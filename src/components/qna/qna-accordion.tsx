import { Fragment } from "react";
import Image from "next/image";

import { DownArrowIcon, UpArrowIcon } from "@/components/icons";
import type { QnaItem, QnaTextSegment } from "@/types/qna";

type QnaAccordionProps = {
  readonly items: readonly QnaItem[];
};

export function QnaAccordion({ items }: QnaAccordionProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <details className="group" key={item.question}>
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 items-center gap-4">
              <Image
                alt=""
                aria-hidden
                className="size-8 shrink-0"
                height={32}
                src="/icon/24dp/question.svg"
                width={32}
              />
              <span className="type-heading-7 text-grayscale-800">
                {item.question}
              </span>
            </span>

            <DownArrowIcon
              aria-hidden
              className="size-8 shrink-0 text-grayscale-700 group-open:hidden"
              focusable="false"
            />
            <UpArrowIcon
              aria-hidden
              className="hidden size-8 shrink-0 text-grayscale-700 group-open:block"
              focusable="false"
            />
          </summary>

          <div className="mt-4 rounded-[20px] bg-grayscale-50 px-6 py-6 lg:pr-[145px]">
            <div className="type-heading-10 text-grayscale-700">
              {item.answer.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  <QnaText segments={paragraph} />
                </p>
              ))}

              {item.answer.listItems ? (
                <ul className="mt-5 list-disc space-y-2.5 pl-[26px]">
                  {item.answer.listItems.map((listItem, index) => (
                    <li key={index}>
                      <QnaText segments={listItem} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

type QnaTextProps = {
  readonly segments: readonly QnaTextSegment[];
};

function QnaText({ segments }: QnaTextProps) {
  return segments.map((segment, index) => {
    const className = [
      segment.emphasis ? "font-bold" : "",
      segment.underline ? "underline" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Fragment key={`${segment.text}-${index}`}>
        {className ? <span className={className}>{segment.text}</span> : segment.text}
      </Fragment>
    );
  });
}
