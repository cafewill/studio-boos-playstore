// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "rainbow-plate",
  "title": "한 접시 무지개",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "밥·당근·완두·달걀를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "plate",
    "ingredients": [
      {
        "label": "밥",
        "symbol": "🍚",
        "color": "#e9dfc8"
      },
      {
        "label": "당근",
        "symbol": "🥕",
        "color": "#d29a69"
      },
      {
        "label": "완두",
        "symbol": "🟢",
        "color": "#82a783"
      },
      {
        "label": "달걀",
        "symbol": "🥚",
        "color": "#e1cb85"
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
    "symbol": "🍚",
    "detail": "밥·당근·완두·달걀"
  }
};
