import type { QnaItem } from "@/types/qna";

export const mockQnaItems = [
  {
    question: "메이트는 어떤 서비스인가요?",
    answer: {
      paragraphs: [
        [
          { text: "바쁜 사장님을 위해 " },
          {
            text: "우리 회사에 딱 맞는 입찰공고를 실시간",
            emphasis: true,
          },
          {
            text: "으로 찾아드려요. 중요한 마감 소식부터 개찰 결과까지 메이트가 알아서 다 챙겨줄게요!",
          },
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
            text: " 에서 새로운 이메일을 한 번만 인증하면, 그 메일로 공고 소식을 실시간으로 보내드릴게요.",
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
          { text: "사장님이 등록한 회사의 정보로 " },
          { text: "회사의 업종, 실적, 지역 정보", emphasis: true },
          { text: "를 바탕으로 메이트가 매일 수많은 공고를 하나씩 분석해요." },
        ],
        [
          {
            text: "그중 사장님의 회사에 딱 맞는 최적의 공고만 골라내어 추천해 드려요!",
          },
        ],
      ],
    },
  },
  {
    question: "실시간 알림은 어떤 상황에서 오게 되나요?",
    answer: {
      paragraphs: [
        [
          {
            text: "사장님이 꼭 아셔야 하는 중요한 변화가 생기면 놓치지 않게 바로 알려드려요. 주로 이런 상황에서 실시간 소식이 가요!",
          },
        ],
      ],
      listItems: [
        [
          { text: "우리 회사에 " },
          { text: "딱 맞는 새로운 공고가 등록", emphasis: true },
          { text: "되었을 때" },
        ],
        [
          { text: "관심 있는 " },
          {
            text: "공고의 마감 시간이 다가오거나 내용이 수정",
            emphasis: true,
          },
          { text: "되었을 때" },
        ],
        [
          { text: "애타게 기다리던 " },
          { text: "공고의 개찰 결과", emphasis: true },
          { text: "가 나왔을 때" },
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
            text: "지금은 메이트 서비스 안의 '소식' 과 등록하신 '이메일'을 통해 실시간 알림을 보내드리고 있어요! 가입 메일 말고 다른 메일로도 받고 싶다면",
          },
        ],
        [
          { text: "마이페이지 > ", emphasis: true },
          { text: "알림 설정", emphasis: true, underline: true },
          {
            text: " 에서 추가해 보세요. 사장님들이 가장 편해하실 카카오톡 알림도 지금 열심히 만들고 있으니 조금만 기다려주세요!",
          },
        ],
      ],
    },
  },
] satisfies readonly QnaItem[];
