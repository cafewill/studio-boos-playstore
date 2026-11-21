// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "picnic-sandwich",
  "title": "소풍 샌드위치 공방",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "빵·잎 채소·토마토·치즈를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "sandwich",
    "ingredients": [
      {
        "label": "빵",
        "symbol": "🍞",
        "color": "#d5ad7d"
      },
      {
        "label": "잎 채소",
        "symbol": "🥬",
        "color": "#8ca788"
      },
      {
        "label": "토마토",
        "symbol": "🍅",
        "color": "#bd7866"
      },
      {
        "label": "치즈",
        "symbol": "🧀",
        "color": "#e2c77e"
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
    "symbol": "🍞",
    "detail": "빵·잎 채소·토마토·치즈"
  }
};
