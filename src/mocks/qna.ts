import type { QnaItem } from "@/types/qna";

export const mockQnaItems = [
  {
    question: "메이트는 어떤 서비스인가요?",
    answer: {
      paragraphs: [
        [
          { text: "메이트에서는 공개 입찰공고를 찾아보고, " },
          { text: "관심 공고의 변화", emphasis: true },
          { text: "를 서비스 안에서 확인할 수 있어요. " },
          { text: "맞춤 공고 이메일", emphasis: true },
          { text: "은 별도로 켰을 때 하루 한 번 보내드려요." },
        ],
      ],
    },
  },
  {
    question: "가입한 이메일 말고 다른 이메일로 알림을 받을 수 있나요?",
    answer: {
      paragraphs: [
        [
          { text: "네, 가능해요! " },
          { text: "마이페이지 > ", emphasis: true },
          { text: "알림 설정", emphasis: true, underline: true },
          {
            text: "에서 다른 이메일을 인증하고 수신 주소로 선택할 수 있어요. 맞춤 공고 이메일을 켜두면 매일 오전 8시 30분에 선택한 주소로 보내드려요. 공고별 변화는 서비스 내부 알림에서 확인할 수 있어요.",
          },
        ],
      ],
    },
  },
  {
    question: "나에게 맞는 공고는 어떤 기준으로 매칭되나요?",
    answer: {
      paragraphs: [
        [
          { text: "맞춤 공고는 " },
          { text: "개인 공고 필터", emphasis: true },
          { text: "의 조건에 맞는 새 공고를 기준으로 골라요. " },
          { text: "회사 지역·업종·희망 금액대", emphasis: true },
          { text: "는 개인 필터를 처음 쓸 때 기본값으로 활용돼요." },
        ],
        [
          {
            text: "직접 저장한 개인 필터는 회사 정보가 바뀌어도 자동으로 덮어쓰지 않아요. 조건에 맞는 공고를 찾는 기능이며, 입찰 참가 자격을 보장하지는 않아요.",
          },
        ],
      ],
    },
  },
  {
    question: "공고 알림은 어떤 상황에서 오게 되나요?",
    answer: {
      paragraphs: [
        [
          {
            text: "알림을 켜둔 공고에 아래 변화가 생기면 서비스 내부 알림으로 알려드려요.",
          },
        ],
      ],
      listItems: [
        [
          { text: "공고 내용이 " },
          { text: "정정되거나 재공고", emphasis: true },
          { text: "되었을 때" },
        ],
        [
          { text: "공고의 " },
          { text: "입찰 마감 시간", emphasis: true },
          { text: "이 다가왔을 때" },
        ],
        [
          { text: "공고의 개찰 결과", emphasis: true },
          { text: "가 처음 공개되었을 때" },
        ],
      ],
    },
  },
  {
    question: "알림을 카카오톡이나 문자(SMS)로도 받아볼 수 있나요?",
    answer: {
      paragraphs: [
        [
          {
            text: "현재 카카오톡이나 문자(SMS) 알림은 제공하지 않아요. 공고별 변화는 ",
          },
          { text: "서비스 내부 알림", emphasis: true },
          { text: "으로, 조건에 맞는 새 공고는 수신 설정을 켠 경우 " },
          { text: "매일 오전 8시 30분 맞춤 공고 이메일", emphasis: true },
          { text: "로 안내해요." },
        ],
        [
          {
            text: "가입 이메일 대신 다른 주소에서 맞춤 공고를 받고 싶다면 마이페이지 > ",
          },
          { text: "알림 설정", emphasis: true, underline: true },
          { text: "에서 대체 이메일을 인증하고 수신 주소를 바꿀 수 있어요." },
        ],
      ],
    },
  },
] satisfies readonly QnaItem[];
