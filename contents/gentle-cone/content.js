// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "gentle-cone",
  "title": "포근한 아이스크림 콘",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "콘·바닐라·딸기·초록 장식를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "cone",
    "ingredients": [
      {
        "label": "콘",
        "symbol": "🍦",
        "color": "#c9a57d"
      },
      {
        "label": "바닐라",
        "symbol": "🥛",
        "color": "#eee2c6"
      },
      {
        "label": "딸기",
        "symbol": "🍓",
        "color": "#cd8b92"
      },
      {
        "label": "초록 장식",
        "symbol": "🍃",
        "color": "#86a08a"
      }
    ],
    "recipe": [
      0,
      1,
      2,
      3
    ]
  },
  "accent": "#965335",
  "presentation": {
    "symbol": "🍦",
    "detail": "콘·바닐라·딸기·초록 장식"
  }
};
