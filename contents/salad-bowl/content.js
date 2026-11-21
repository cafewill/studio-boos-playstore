// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "salad-bowl",
  "title": "아삭한 색 바구니",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "잎 채소·오이·토마토·옥수수를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "bowl",
    "ingredients": [
      {
        "label": "잎 채소",
        "symbol": "🥬",
        "color": "#88a884"
      },
      {
        "label": "오이",
        "symbol": "🥒",
        "color": "#a3b999"
      },
      {
        "label": "토마토",
        "symbol": "🍅",
        "color": "#c77b72"
      },
      {
        "label": "옥수수",
        "symbol": "🌽",
        "color": "#dfcb88"
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
    "symbol": "🥬",
    "detail": "잎 채소·오이·토마토·옥수수"
  }
};
