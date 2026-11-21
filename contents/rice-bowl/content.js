// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "rice-bowl",
  "title": "따뜻한 밥그릇 상상",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "밥·완두·당근·김를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "bowl",
    "ingredients": [
      {
        "label": "밥",
        "symbol": "🍚",
        "color": "#e7deca"
      },
      {
        "label": "완두",
        "symbol": "🟢",
        "color": "#86a282"
      },
      {
        "label": "당근",
        "symbol": "🥕",
        "color": "#cf9a73"
      },
      {
        "label": "김",
        "symbol": "◼️",
        "color": "#677568"
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
    "detail": "밥·완두·당근·김"
  }
};
