// 생성 파일: data/implementation/expansion30.json이 정본이다. 직접 편집하지 않는다.
export const definition = {
  "schemaVersion": 1,
  "definitionVersion": 1,
  "slug": "sharing-pizza",
  "title": "나누는 피자 한 판",
  "engine": "recipe",
  "variant": "layers",
  "family": "재료·쌓기",
  "ageMin": 5,
  "ageMax": 8,
  "roundCount": 1,
  "objective": "그림 주문표의 순서대로 가상 재료를 쌓고 확인해요.",
  "description": "반죽·소스·버섯·옥수수를 주문표 순서로 올려요. 잘못 놓았으면 한 층을 되돌릴 수 있어요.",
  "params": {
    "dish": "pizza",
    "ingredients": [
      {
        "label": "반죽",
        "symbol": "🫓",
        "color": "#d8bb8d"
      },
      {
        "label": "소스",
        "symbol": "🍅",
        "color": "#bc6554"
      },
      {
        "label": "버섯",
        "symbol": "🍄",
        "color": "#b7a28f"
      },
      {
        "label": "옥수수",
        "symbol": "🌽",
        "color": "#dfc96f"
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
    "detail": "반죽·소스·버섯·옥수수"
  }
};
