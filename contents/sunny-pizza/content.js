// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "sunny-pizza",
  "title": "햇살 피자 작업대",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "반죽·토마토·치즈·잎 채소를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "pizza",
    "ingredients": [
      {
        "label": "반죽",
        "symbol": "🫓",
        "color": "#d9b580"
      },
      {
        "label": "토마토",
        "symbol": "🍅",
        "color": "#bc6554"
      },
      {
        "label": "치즈",
        "symbol": "🧀",
        "color": "#e6c772"
      },
      {
        "label": "잎 채소",
        "symbol": "🥬",
        "color": "#81a181"
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
    "symbol": "🫓",
    "detail": "반죽·토마토·치즈·잎 채소"
  }
};
