import Image from "next/image";

type AlarmEmptyProps = {
  focusRef?: React.Ref<HTMLElement>;
};

export function AlarmEmpty({ focusRef }: AlarmEmptyProps) {
  return (
    <section
      aria-labelledby="alarm-empty-title"
      className="grid flex-1 place-items-center px-4 pb-14 focus:outline-none sm:px-6"
      ref={focusRef}
      tabIndex={-1}
    >
      <div className="flex w-full max-w-[369px] flex-col items-center gap-4 text-center">
        <Image
          alt="소식을 기다리는 사장님"
          className="size-[120px]"
          height={120}
          priority
          src="/images/alarms/no-result.png"
          width={120}
        />
        <div className="flex flex-col gap-2">
          <h1 id="alarm-empty-title" className="type-heading-7 text-grayscale-800">
            사장님! 아직 소식이 오지 않았어요!
          </h1>
          <p className="type-body-3 text-grayscale-600">
            메이트의 소식, 입찰 알림이 오면
            <br />
            사장님에게 소식을 바로 알려드릴게요!
          </p>
        </div>
      </div>
    </section>
  );
}
