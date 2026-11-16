"use client";

import Image from "next/image";
import { useState } from "react";
import { AddIcon, MinusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function DocumentOriginalViewer({ url, contentType, filename }: { url: string; contentType: string; filename: string }) {
  const [zoom, setZoom] = useState(100);
  const [failed, setFailed] = useState(false);
  if (failed) return <p role="alert" className="rounded-xl bg-grayscale-50 p-6 type-body-3 text-grayscale-600">원본을 표시하지 못했어요. 원본 다시 확인 또는 다운로드를 이용해 주세요.</p>;
  return contentType === "application/pdf" ? <>
    <iframe src={url} title={`${filename} PDF 미리보기`} className="h-[720px] min-h-96 w-full rounded-xl bg-grayscale-50" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
    <p className="mt-3 type-body-7 text-grayscale-600">PDF 도구는 브라우저 기본 뷰어를 사용해요. 표시되지 않으면 다운로드로 확인해 주세요.</p>
  </> : <>
    <div className="mb-4 flex items-center justify-end gap-2" aria-label="이미지 확대 및 축소">
      <Button size="xs" variant="text_gray" aria-label="이미지 축소" disabled={zoom <= 50} onClick={() => setZoom(value => Math.max(50, value - 25))}><MinusIcon aria-hidden className="size-5" /></Button>
      <span className="min-w-12 text-center type-body-7 text-grayscale-700" role="status">{zoom}%</span>
      <Button size="xs" variant="text_gray" aria-label="이미지 확대" disabled={zoom >= 200} onClick={() => setZoom(value => Math.min(200, value + 25))}><AddIcon aria-hidden className="size-5" /></Button>
    </div>
    <div className="max-h-[720px] min-h-96 overflow-auto rounded-xl bg-grayscale-50 p-4" role="region" aria-label="서류 이미지 미리보기" tabIndex={0}>
      <Image src={url} alt={`${filename} 원본`} width={600} height={800} unoptimized className="mx-auto h-auto max-w-none" style={{ width: `${zoom}%` }} onError={() => setFailed(true)} />
    </div>
  </>;
}
