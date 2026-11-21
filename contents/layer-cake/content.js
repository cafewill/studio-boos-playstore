// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "layer-cake",
  "title": "차곡차곡 케이크",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "빵·크림·딸기·블루베리를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "cake",
    "ingredients": [
      {
        "label": "빵",
        "symbol": "🍰",
        "color": "#cba17b"
      },
      {
        "label": "크림",
        "symbol": "🥛",
        "color": "#eee5d1"
      },
      {
        "label": "딸기",
        "symbol": "🍓",
        "color": "#c47e87"
      },
      {
        "label": "블루베리",
        "symbol": "🫐",
        "color": "#979db8"
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
    "symbol": "🍰",
    "detail": "빵·크림·딸기·블루베리"
  }
};
