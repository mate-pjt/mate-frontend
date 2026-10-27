import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";
const root = path.resolve("src");
function files(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? files(path.join(dir, item.name)) : /\.[cm]?[jt]sx?$/.test(item.name) ? [path.join(dir, item.name)] : []); }
type ModuleReference = { specifier: string; typeOnly: boolean };
function imports(file: string, source = readFileSync(file, "utf8")) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true); const values: ModuleReference[] = [];
  function walk(node: ts.Node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const typeOnly = ts.isImportDeclaration(node)
        ? Boolean(node.importClause?.isTypeOnly || (node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings) && !node.importClause.name && node.importClause.namedBindings.elements.length > 0 && node.importClause.namedBindings.elements.every(item => item.isTypeOnly)))
        : node.isTypeOnly;
      values.push({ specifier: node.moduleSpecifier.text, typeOnly });
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) values.push({ specifier: node.arguments[0].text, typeOnly: false });
    ts.forEachChild(node, walk);
  }
  walk(ast); return values;
}
function resolveModule(file: string, specifier: string) {
  return specifier.startsWith("@/") ? path.join(root, specifier.slice(2)) : specifier.startsWith(".") ? path.resolve(path.dirname(file), specifier) : null;
}
function forbidden(file: string, reference: ModuleReference) {
  const target = resolveModule(file, reference.specifier);
  if (!target) return false;
  const relative = path.relative(root, target).replaceAll(path.sep, "/");
  return relative.startsWith("mocks/")
    || /^data\/.*(http-repository|mock-repository|api-types|api-mapper|shared\/client)/.test(relative)
    || (!reference.typeOnly && /^data\/shared\/http(?:\.[jt]s)?$/.test(relative));
}
it("화면·feature는 공개 진입점과 내부 모델만 참조한다", () => {
  const violations: string[] = [];
  for (const file of [...files(path.join(root,"app")), ...files(path.join(root,"components")), ...files(path.join(root,"features"))]) {
    const source = readFileSync(file,"utf8");
    for (const imported of imports(file)) if (forbidden(file, imported)) violations.push(`${path.relative(root,file)}: ${imported.specifier}`);
    if (/\bfetch\s*\(|["'`]\/api\/v1\//.test(source)) violations.push(`${path.relative(root,file)}: direct HTTP`);
  }
  expect(violations).toEqual([]);
});
it("구조 검사는 상대경로·동적 import·HTTP 값 import도 거부하고 AuthAccess 타입은 허용한다", () => {
  const file = path.join(root, "components", "example.tsx");
  const references = imports(file, `
    import { createHttpClient } from "../data/shared/http";
    import type { AuthAccess } from "@/data/shared/http";
    import { type AuthAccess as Access } from "../data/shared/http";
    import {} from "../data/shared/http";
    import type { WireDto } from "../data/company/api-types";
    export { createMockCompanyRepository } from "../data/company/mock-repository";
    const adapter = import("../data/company/http-repository");
  `);
  expect(references.map(reference => forbidden(file, reference))).toEqual([true, false, false, true, true, true, true]);
});
it("클라이언트 진입점 의존 그래프에 서버 전용 모듈이 없다", () => {
  const visited = new Set<string>(); const violations: string[] = [];
  function walk(file: string) {
    if (visited.has(file)) return; visited.add(file);
    for (const imported of imports(file)) {
      if (imported.typeOnly) continue;
      if (imported.specifier === "server-only") violations.push(path.relative(root,file));
      const base = resolveModule(file, imported.specifier);
      if (base) { const target = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")].find(candidate => filesCache.has(candidate)); if (target) walk(target); }
    }
  }
  const filesCache = new Set(files(root));
  for (const file of filesCache) if ((file.includes("/data/") && file.endsWith("/client.ts")) || /^\s*["']use client["']/.test(readFileSync(file, "utf8"))) walk(file);
  expect(violations).toEqual([]);
});
