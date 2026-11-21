// 생성 파일: data/implementation/registry.json에 등록한 배치 정의에서 생성한다.
export const CONTENTS = [
  {
    "slug": "count-trail",
    "title": "차근차근 수 놀이터",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "그림 속 물체를 하나씩 세고, 개수에 맞는 숫자 버튼을 골라요.",
    "preview": {
      "engine": "choice",
      "variant": "count",
      "params": {
        "min": 1,
        "max": 5,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "1부터 5까지 세기"
      }
    },
    "href": "count-trail/",
    "engine": "choice"
  },
  {
    "slug": "number-meadow",
    "title": "열까지의 들꽃",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "다섯 개에서 열 개까지 세어 보며 작은 수보다 많은 수를 살펴봐요.",
    "preview": {
      "engine": "choice",
      "variant": "count",
      "params": {
        "min": 5,
        "max": 10,
        "secondMax": 3,
        "direction": "more",
        "motif": "flower"
      },
      "presentation": {
        "symbol": "",
        "detail": "5부터 10까지 세기"
      }
    },
    "href": "number-meadow/",
    "engine": "choice"
  },
  {
    "slug": "leaf-sketch",
    "title": "잎사귀 스케치북",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "잎의 윤곽과 잎맥 안내선 위에 색을 더하거나 새로운 선을 그려요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "leaf"
      },
      "presentation": {
        "symbol": "",
        "detail": "잎과 잎맥"
      }
    },
    "href": "leaf-sketch/",
    "engine": "drawing"
  },
  {
    "slug": "cloud-paint",
    "title": "구름 물감놀이",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "둥근 구름 안내선에 색을 칠하고, 구름 밖으로도 자유롭게 그려요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "cloud"
      },
      "presentation": {
        "symbol": "",
        "detail": "구름의 윤곽"
      }
    },
    "href": "cloud-paint/",
    "engine": "drawing"
  },
  {
    "slug": "color-walk",
    "title": "빛깔 산책",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "초록·파랑·주황의 이름과 색을 보고 같은 빛깔을 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "color",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "색 이름과 빛깔"
      }
    },
    "href": "color-walk/",
    "engine": "choice"
  },
  {
    "slug": "add-basket",
    "title": "함께 담는 바구니",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "두 묶음의 그림을 함께 세고, 더한 수를 골라요.",
    "preview": {
      "engine": "choice",
      "variant": "add",
      "params": {
        "min": 1,
        "max": 5,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "두 묶음 더하기"
      }
    },
    "href": "add-basket/",
    "engine": "choice"
  },
  {
    "slug": "share-fruit",
    "title": "나누어 주는 열매",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "그림에서 나누어 준 개수를 빼고 남은 수를 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "subtract",
      "params": {
        "min": 3,
        "max": 8,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "남은 수 찾기"
      }
    },
    "href": "share-fruit/",
    "engine": "choice"
  },
  {
    "slug": "shape-garden",
    "title": "모양 정원",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "목표로 나온 동그라미·네모·세모와 같은 모양 버튼을 눌러요.",
    "preview": {
      "engine": "choice",
      "variant": "shape",
      "params": {
        "motif": "circle",
        "generator": "balanced-v1"
      },
      "presentation": {
        "symbol": "",
        "detail": "같은 도형 찾기"
      }
    },
    "href": "shape-garden/",
    "engine": "choice"
  },
  {
    "slug": "number-bridge",
    "title": "숫자 징검다리",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "숫자 뒤의 빈자리를 보고 다음에 이어질 수를 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "sequence",
      "params": {
        "min": 1,
        "max": 8,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "다음 수 찾기"
      }
    },
    "href": "number-bridge/",
    "engine": "choice"
  },
  {
    "slug": "sprout-code",
    "title": "새싹 길찾기",
    "age": "6–8세와 함께",
    "ageMin": 6,
    "ageMax": 8,
    "category": "명령 순서",
    "description": "방향 버튼으로 이동 명령을 쌓고, 실행해서 목적지에 닿는 길을 살펴봐요.",
    "preview": {
      "engine": "commands",
      "variant": "path",
      "params": {},
      "presentation": {
        "symbol": "",
        "detail": "방향 명령 이어 놓기"
      }
    },
    "href": "sprout-code/",
    "engine": "commands"
  },
  {
    "slug": "flower-stamps",
    "title": "꽃잎 도장놀이",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "꽃과 줄기의 안내선을 따라 그리거나, 위치 버튼으로 색점을 찍어요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "flower"
      },
      "presentation": {
        "symbol": "",
        "detail": "꽃과 줄기"
      }
    },
    "href": "flower-stamps/",
    "engine": "drawing"
  },
  {
    "slug": "piece-path",
    "title": "조각 오솔길",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "모양·분류·퍼즐",
    "description": "작은 참고 그림의 아홉 자리를 보고, 각 자리에 같은 도형을 놓아요.",
    "preview": {
      "engine": "assembly",
      "variant": "puzzle",
      "params": {
        "targets": [
          [
            "blank",
            "triangle",
            "blank",
            "square",
            "square",
            "square",
            "blank",
            "square",
            "blank"
          ],
          [
            "blank",
            "circle",
            "blank",
            "leaf",
            "square",
            "leaf",
            "blank",
            "square",
            "blank"
          ],
          [
            "triangle",
            "triangle",
            "triangle",
            "square",
            "blank",
            "square",
            "square",
            "square",
            "square"
          ]
        ],
        "template": "mosaic"
      },
      "presentation": {
        "symbol": "",
        "detail": "참고 그림 맞추기"
      }
    },
    "href": "piece-path/",
    "engine": "assembly"
  },
  {
    "slug": "first-three",
    "title": "하나 둘 셋 정원",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "하나·둘·셋을 세고 숫자와 연결하는 첫 수 놀이예요.",
    "preview": {
      "engine": "choice",
      "variant": "count",
      "params": {
        "min": 1,
        "max": 3,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "1부터 3까지 세기"
      }
    },
    "href": "first-three/",
    "engine": "choice"
  },
  {
    "slug": "group-two",
    "title": "둘씩 모인 꽃밭",
    "age": "6–8세와 함께",
    "ageMin": 6,
    "ageMax": 8,
    "category": "수·연산",
    "description": "두 개씩 모인 점 묶음이 모두 몇 개인지 세어 봐요.",
    "preview": {
      "engine": "choice",
      "variant": "multiply",
      "params": {
        "min": 2,
        "max": 2,
        "secondMax": 4,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "2개씩 묶어 세기"
      }
    },
    "href": "group-two/",
    "engine": "choice"
  },
  {
    "slug": "sound-dew",
    "title": "소리 이슬",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "소리 탐색",
    "description": "낮은 도부터 높은 라까지 직접 눌러 음 높이의 차이를 들어 봐요.",
    "preview": {
      "engine": "sound",
      "variant": "notes",
      "params": {
        "timbre": "sine"
      },
      "presentation": {
        "symbol": "",
        "detail": "낮은 소리부터 높은 소리까지"
      }
    },
    "href": "sound-dew/",
    "engine": "sound"
  },
  {
    "slug": "little-house-art",
    "title": "작은 집 그림방",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "지붕·문·창문이 있는 집 안내선에 나만의 선과 색을 더해요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "house"
      },
      "presentation": {
        "symbol": "",
        "detail": "지붕과 창문"
      }
    },
    "href": "little-house-art/",
    "engine": "drawing"
  },
  {
    "slug": "sky-doodle",
    "title": "하늘 낙서 산책",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "구름과 별, 하늘 아래 곡선에 원하는 색을 얹어요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "sky"
      },
      "presentation": {
        "symbol": "",
        "detail": "구름과 별"
      }
    },
    "href": "sky-doodle/",
    "engine": "drawing"
  },
  {
    "slug": "forest-colors",
    "title": "숲속 색연필",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "키가 다른 세 나무의 윤곽을 보며 숲의 색을 만들어 봐요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "forest"
      },
      "presentation": {
        "symbol": "",
        "detail": "세 그루 나무"
      }
    },
    "href": "forest-colors/",
    "engine": "drawing"
  },
  {
    "slug": "star-lines",
    "title": "별빛 선 이어보기",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "큰 별의 꼭짓점과 작은 반짝임에 선과 점을 더해요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "star"
      },
      "presentation": {
        "symbol": "",
        "detail": "별과 반짝임"
      }
    },
    "href": "star-lines/",
    "engine": "drawing"
  },
  {
    "slug": "rainbow-page",
    "title": "무지개 그림 한 장",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "네 겹의 둥근 무지개 선을 따라 색을 고르거나 새로운 길을 그려요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "rainbow"
      },
      "presentation": {
        "symbol": "",
        "detail": "네 겹 무지개"
      }
    },
    "href": "rainbow-page/",
    "engine": "drawing"
  },
  {
    "slug": "round-friends",
    "title": "동그라미 친구들",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "화면의 목표 도형을 살펴보고 같은 윤곽의 도형을 골라요.",
    "preview": {
      "engine": "choice",
      "variant": "shape",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "같은 도형 찾기"
      }
    },
    "href": "round-friends/",
    "engine": "choice"
  },
  {
    "slug": "wave-notebook",
    "title": "물결 노트",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "위아래로 굽이치는 세 물결 위에 길고 짧은 선을 그려요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "waves"
      },
      "presentation": {
        "symbol": "",
        "detail": "세 줄 물결"
      }
    },
    "href": "wave-notebook/",
    "engine": "drawing"
  },
  {
    "slug": "shape-secret",
    "title": "다음 모양의 비밀",
    "age": "5–7세와 함께",
    "ageMin": 5,
    "ageMax": 7,
    "category": "모양·분류·퍼즐",
    "description": "이미 놓인 모양 세 개를 보고 다음에 이어질 모양을 예상해요.",
    "preview": {
      "engine": "choice",
      "variant": "pattern",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "도형의 반복 규칙"
      }
    },
    "href": "shape-secret/",
    "engine": "choice"
  },
  {
    "slug": "missing-path",
    "title": "비어 있는 수 오솔길",
    "age": "6–8세와 함께",
    "ageMin": 6,
    "ageMax": 8,
    "category": "수·연산",
    "description": "더하기 식의 빈자리에 어떤 수가 들어가는지 알아봐요.",
    "preview": {
      "engine": "choice",
      "variant": "missing",
      "params": {
        "min": 1,
        "max": 4,
        "secondMax": 4,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "빈자리 수 찾기"
      }
    },
    "href": "missing-path/",
    "engine": "choice"
  },
  {
    "slug": "day-clock",
    "title": "하루 시계 정원",
    "age": "6–8세와 함께",
    "ageMin": 6,
    "ageMax": 8,
    "category": "시간 읽기",
    "description": "시침을 한 칸씩, 분침을 30분씩 바꿔 제시된 시간을 만들어요.",
    "preview": {
      "engine": "clock",
      "variant": "analog",
      "params": {
        "halfHours": true
      },
      "presentation": {
        "symbol": "",
        "detail": "정각과 30분"
      }
    },
    "href": "day-clock/",
    "engine": "clock"
  },
  {
    "slug": "size-baskets",
    "title": "크기 바구니",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "작은 것·중간 것·큰 것 중 목표와 크기가 같은 그림을 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "size",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "같은 크기 찾기"
      }
    },
    "href": "size-baskets/",
    "engine": "choice"
  },
  {
    "slug": "sea-pieces",
    "title": "물결 조각 찾기",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "모양·분류·퍼즐",
    "description": "참고 모자이크와 내 아홉 칸을 비교하며 조각의 위치를 맞춰요.",
    "preview": {
      "engine": "assembly",
      "variant": "puzzle",
      "params": {
        "targets": [
          [
            "blank",
            "circle",
            "blank",
            "leaf",
            "square",
            "leaf",
            "blank",
            "square",
            "blank"
          ],
          [
            "triangle",
            "triangle",
            "triangle",
            "square",
            "blank",
            "square",
            "square",
            "square",
            "square"
          ],
          [
            "blank",
            "triangle",
            "blank",
            "square",
            "square",
            "square",
            "blank",
            "square",
            "blank"
          ]
        ],
        "template": "mosaic"
      },
      "presentation": {
        "symbol": "",
        "detail": "참고 그림 맞추기"
      }
    },
    "href": "sea-pieces/",
    "engine": "assembly"
  },
  {
    "slug": "gentle-seeds",
    "title": "내 속도의 씨앗",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "시간 제한 없이 물체를 세고, 준비됐을 때 숫자를 선택해요.",
    "preview": {
      "engine": "choice",
      "variant": "count",
      "params": {
        "min": 1,
        "max": 5,
        "secondMax": 3,
        "direction": "more",
        "motif": "leaf"
      },
      "presentation": {
        "symbol": "",
        "detail": "1부터 5까지 세기"
      }
    },
    "href": "gentle-seeds/",
    "engine": "choice"
  },
  {
    "slug": "group-three",
    "title": "셋씩 만든 둥지",
    "age": "6–8세와 함께",
    "ageMin": 6,
    "ageMax": 8,
    "category": "수·연산",
    "description": "세 개씩 들어 있는 점 묶음을 모두 합쳐 세어 봐요.",
    "preview": {
      "engine": "choice",
      "variant": "multiply",
      "params": {
        "min": 3,
        "max": 3,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "3개씩 묶어 세기"
      }
    },
    "href": "group-three/",
    "engine": "choice"
  },
  {
    "slug": "picture-pieces",
    "title": "한 장의 조각 그림",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "모양·분류·퍼즐",
    "description": "참고 그림을 보며 동그라미와 세모 같은 조각을 칸마다 골라 넣어요.",
    "preview": {
      "engine": "assembly",
      "variant": "puzzle",
      "params": {
        "targets": [
          [
            "triangle",
            "triangle",
            "triangle",
            "square",
            "blank",
            "square",
            "square",
            "square",
            "square"
          ],
          [
            "blank",
            "triangle",
            "blank",
            "square",
            "square",
            "square",
            "blank",
            "square",
            "blank"
          ],
          [
            "blank",
            "circle",
            "blank",
            "leaf",
            "square",
            "leaf",
            "blank",
            "square",
            "blank"
          ]
        ],
        "template": "mosaic"
      },
      "presentation": {
        "symbol": "",
        "detail": "참고 그림 맞추기"
      }
    },
    "href": "picture-pieces/",
    "engine": "assembly"
  },
  {
    "slug": "kite-sketch",
    "title": "바람과 연 그림",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "마름모 연과 꼬리 안내선에 바람의 길을 상상하며 그려요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "kite"
      },
      "presentation": {
        "symbol": "",
        "detail": "연과 꼬리"
      }
    },
    "href": "kite-sketch/",
    "engine": "drawing"
  },
  {
    "slug": "garden-paint",
    "title": "내가 그린 꽃밭",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "높이가 다른 세 꽃과 땅의 곡선을 나만의 꽃밭으로 색칠해요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "garden"
      },
      "presentation": {
        "symbol": "",
        "detail": "꽃밭의 높낮이"
      }
    },
    "href": "garden-paint/",
    "engine": "drawing"
  },
  {
    "slug": "number-sprouts",
    "title": "차례차례 새싹",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "제시된 수에서 일정하게 늘어나는 다음 수를 골라요.",
    "preview": {
      "engine": "choice",
      "variant": "sequence",
      "params": {
        "min": 1,
        "max": 5,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "다음 수 찾기"
      }
    },
    "href": "number-sprouts/",
    "engine": "choice"
  },
  {
    "slug": "dot-mates",
    "title": "점과 숫자 친구",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "그림의 점을 하나씩 짚어 보고 맞는 숫자를 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "count",
      "params": {
        "min": 3,
        "max": 7,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "3부터 7까지 세기"
      }
    },
    "href": "dot-mates/",
    "engine": "choice"
  },
  {
    "slug": "group-four",
    "title": "넷씩 담은 상자",
    "age": "6–8세와 함께",
    "ageMin": 6,
    "ageMax": 8,
    "category": "수·연산",
    "description": "네 개씩 모인 점들이 몇 묶음인지 보고 전체 개수를 알아봐요.",
    "preview": {
      "engine": "choice",
      "variant": "multiply",
      "params": {
        "min": 4,
        "max": 4,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "4개씩 묶어 세기"
      }
    },
    "href": "group-four/",
    "engine": "choice"
  },
  {
    "slug": "butterfly-paper",
    "title": "나비 종이 한 장",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "좌우로 펼쳐진 나비 날개와 더듬이에 나만의 무늬를 더해요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "butterfly"
      },
      "presentation": {
        "symbol": "",
        "detail": "나비 날개"
      }
    },
    "href": "butterfly-paper/",
    "engine": "drawing"
  },
  {
    "slug": "sound-pebbles",
    "title": "반짝 소리돌",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "소리 탐색",
    "description": "나란한 다섯 소리 버튼을 골라 높낮이와 울림을 탐색해요.",
    "preview": {
      "engine": "sound",
      "variant": "notes",
      "params": {
        "timbre": "triangle"
      },
      "presentation": {
        "symbol": "",
        "detail": "낮은 소리부터 높은 소리까지"
      }
    },
    "href": "sound-pebbles/",
    "engine": "sound"
  },
  {
    "slug": "group-five",
    "title": "다섯 꽃 묶음",
    "age": "6–8세와 함께",
    "ageMin": 6,
    "ageMax": 8,
    "category": "수·연산",
    "description": "다섯 개씩 모인 점 묶음을 세며 묶음의 수와 전체 수를 연결해요.",
    "preview": {
      "engine": "choice",
      "variant": "multiply",
      "params": {
        "min": 5,
        "max": 5,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "5개씩 묶어 세기"
      }
    },
    "href": "group-five/",
    "engine": "choice"
  },
  {
    "slug": "more-pebbles",
    "title": "더 많은 조약돌",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "서로 다른 숫자 세 개를 비교해 가장 큰 수를 골라요.",
    "preview": {
      "engine": "choice",
      "variant": "compare",
      "params": {
        "min": 1,
        "max": 7,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "수의 크기 비교"
      }
    },
    "href": "more-pebbles/",
    "engine": "choice"
  },
  {
    "slug": "leaf-sizes",
    "title": "큰 잎 작은 잎",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "잎 그림의 크기를 비교하고 목표와 같은 크기를 선택해요.",
    "preview": {
      "engine": "choice",
      "variant": "size",
      "params": {
        "motif": "leaf"
      },
      "presentation": {
        "symbol": "",
        "detail": "같은 크기 찾기"
      }
    },
    "href": "leaf-sizes/",
    "engine": "choice"
  },
  {
    "slug": "fewer-leaves",
    "title": "작은 잎 바구니",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "서로 다른 숫자 세 개에서 가장 작은 수를 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "compare",
      "params": {
        "min": 1,
        "max": 7,
        "secondMax": 3,
        "direction": "less",
        "motif": "leaf"
      },
      "presentation": {
        "symbol": "",
        "detail": "수의 크기 비교"
      }
    },
    "href": "fewer-leaves/",
    "engine": "choice"
  },
  {
    "slug": "fruit-colors",
    "title": "열매 색 산책",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "열매의 둥근 윤곽과 잎 안내선에 좋아하는 색을 입혀요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "fruit"
      },
      "presentation": {
        "symbol": "",
        "detail": "열매와 잎"
      }
    },
    "href": "fruit-colors/",
    "engine": "drawing"
  },
  {
    "slug": "dot-garden-art",
    "title": "점을 찍는 정원",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "크기가 다른 점 안내선을 보고 점을 찍거나 점 사이를 이어 봐요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "dots"
      },
      "presentation": {
        "symbol": "",
        "detail": "다양한 점"
      }
    },
    "href": "dot-garden-art/",
    "engine": "drawing"
  },
  {
    "slug": "color-mates",
    "title": "빛깔 짝 친구",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "색 이름을 읽거나 빛깔을 살펴보고 같은 색의 버튼을 눌러요.",
    "preview": {
      "engine": "choice",
      "variant": "color",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "색 이름과 빛깔"
      }
    },
    "href": "color-mates/",
    "engine": "choice"
  },
  {
    "slug": "wheel-workshop",
    "title": "작은 바퀴 공방",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "기하 조립",
    "description": "바퀴를 닮은 동그라미와 여러 도형을 아홉 칸에 놓아 작품을 만들어요.",
    "preview": {
      "engine": "assembly",
      "variant": "creative",
      "params": {
        "template": "car"
      },
      "presentation": {
        "symbol": "",
        "detail": "자유 조각 배치"
      }
    },
    "href": "wheel-workshop/",
    "engine": "assembly"
  },
  {
    "slug": "night-doodle",
    "title": "고요한 밤 낙서",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "초승달과 작은 별 안내선에 고요한 밤의 색을 그려요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "moon"
      },
      "presentation": {
        "symbol": "",
        "detail": "초승달과 별"
      }
    },
    "href": "night-doodle/",
    "engine": "drawing"
  },
  {
    "slug": "snack-shapes",
    "title": "간식 모양놀이",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "동그라미·네모·세모 중 화면에서 보여 준 모양을 다시 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "shape",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "같은 도형 찾기"
      }
    },
    "href": "snack-shapes/",
    "engine": "choice"
  },
  {
    "slug": "village-build",
    "title": "함께 짓는 마을",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "기하 조립",
    "description": "집을 상상하며 네모와 세모 등 도형을 골라 아홉 칸에 자유롭게 놓아요.",
    "preview": {
      "engine": "assembly",
      "variant": "creative",
      "params": {
        "template": "house"
      },
      "presentation": {
        "symbol": "",
        "detail": "자유 조각 배치"
      }
    },
    "href": "village-build/",
    "engine": "assembly"
  },
  {
    "slug": "snow-paper",
    "title": "눈송이 그림 종이",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "여섯 방향으로 뻗은 눈송이 가지에 선과 무늬를 더해요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "snow"
      },
      "presentation": {
        "symbol": "",
        "detail": "눈송이 가지"
      }
    },
    "href": "snow-paper/",
    "engine": "drawing"
  },
  {
    "slug": "leaf-colors",
    "title": "잎 색 찾기",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "색이 다른 그림을 살펴보고 목표 색과 일치하는 그림을 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "color",
      "params": {
        "motif": "leaf"
      },
      "presentation": {
        "symbol": "",
        "detail": "색 이름과 빛깔"
      }
    },
    "href": "leaf-colors/",
    "engine": "choice"
  },
  {
    "slug": "count-ten",
    "title": "열매 열까지",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "여섯 개부터 열 개까지 그림을 세고 알맞은 숫자를 눌러요.",
    "preview": {
      "engine": "choice",
      "variant": "count",
      "params": {
        "min": 6,
        "max": 10,
        "secondMax": 3,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "6부터 10까지 세기"
      }
    },
    "href": "count-ten/",
    "engine": "choice"
  },
  {
    "slug": "first-triangle",
    "title": "처음 만난 세모",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "세모를 포함한 세 가지 기본 도형의 윤곽을 비교해요.",
    "preview": {
      "engine": "choice",
      "variant": "shape",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "같은 도형 찾기"
      }
    },
    "href": "first-triangle/",
    "engine": "choice"
  },
  {
    "slug": "train-workshop",
    "title": "이어지는 기차",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "기하 조립",
    "description": "차체와 바퀴를 상상하며 아홉 칸에 기하 조각을 이어 놓아요.",
    "preview": {
      "engine": "assembly",
      "variant": "creative",
      "params": {
        "template": "train"
      },
      "presentation": {
        "symbol": "",
        "detail": "자유 조각 배치"
      }
    },
    "href": "train-workshop/",
    "engine": "assembly"
  },
  {
    "slug": "feeling-weather",
    "title": "오늘의 마음 날씨",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "감정 탐색",
    "description": "생활 장면을 읽고 기쁨·속상함·차분함·설렘 중 떠오르는 마음을 골라요.",
    "preview": {
      "engine": "feelings",
      "variant": "reflect",
      "params": {
        "scenes": [
          {
            "title": "친구와 꽃을 함께 심었어요.",
            "art": "flower"
          },
          {
            "title": "쌓던 블록이 무너졌어요.",
            "art": "blocks"
          },
          {
            "title": "조용히 구름을 바라봐요.",
            "art": "cloud"
          },
          {
            "title": "새로운 놀이터에 왔어요.",
            "art": "tree"
          }
        ]
      },
      "presentation": {
        "symbol": "",
        "detail": "서로 다른 마음의 이름"
      }
    },
    "href": "feeling-weather/",
    "engine": "feelings"
  },
  {
    "slug": "mosaic-garden",
    "title": "작은 모자이크 정원",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "모양·분류·퍼즐",
    "description": "작은 도형 모자이크를 관찰하고 같은 칸에 같은 조각을 배치해요.",
    "preview": {
      "engine": "assembly",
      "variant": "puzzle",
      "params": {
        "targets": [
          [
            "blank",
            "triangle",
            "blank",
            "square",
            "square",
            "square",
            "blank",
            "square",
            "blank"
          ],
          [
            "blank",
            "circle",
            "blank",
            "leaf",
            "square",
            "leaf",
            "blank",
            "square",
            "blank"
          ],
          [
            "triangle",
            "triangle",
            "triangle",
            "square",
            "blank",
            "square",
            "square",
            "square",
            "square"
          ]
        ],
        "template": "mosaic"
      },
      "presentation": {
        "symbol": "",
        "detail": "참고 그림 맞추기"
      }
    },
    "href": "mosaic-garden/",
    "engine": "assembly"
  },
  {
    "slug": "bead-join",
    "title": "구슬 모아보기",
    "age": "4–7세와 함께",
    "ageMin": 4,
    "ageMax": 7,
    "category": "수·연산",
    "description": "따로 놓인 두 점 묶음을 함께 세어 더한 수를 찾아요.",
    "preview": {
      "engine": "choice",
      "variant": "add",
      "params": {
        "min": 1,
        "max": 4,
        "secondMax": 4,
        "direction": "more",
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "두 묶음 더하기"
      }
    },
    "href": "bead-join/",
    "engine": "choice"
  },
  {
    "slug": "tree-art",
    "title": "나의 작은 나무",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "자유 미술",
    "description": "나무줄기와 둥근 나뭇잎 덩어리의 윤곽에 계절의 색을 더해요.",
    "preview": {
      "engine": "drawing",
      "variant": "free",
      "params": {
        "template": "tree"
      },
      "presentation": {
        "symbol": "",
        "detail": "줄기와 나뭇잎"
      }
    },
    "href": "tree-art/",
    "engine": "drawing"
  },
  {
    "slug": "color-baskets",
    "title": "나란한 색 바구니",
    "age": "3–5세와 함께",
    "ageMin": 3,
    "ageMax": 5,
    "category": "모양·분류·퍼즐",
    "description": "세 가지 빛깔을 구별하고 안내된 색을 같은 색 버튼과 연결해요.",
    "preview": {
      "engine": "choice",
      "variant": "color",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "색 이름과 빛깔"
      }
    },
    "href": "color-baskets/",
    "engine": "choice"
  },
  {
    "slug": "gift-workshop",
    "title": "다정한 선물 공방",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "만들기·패턴",
    "description": "꽃·잎·기본 도형을 아홉 칸에 조합해 나만의 조각 작품을 만들어요.",
    "preview": {
      "engine": "assembly",
      "variant": "creative",
      "params": {
        "template": "flower"
      },
      "presentation": {
        "symbol": "",
        "detail": "자유 조각 배치"
      }
    },
    "href": "gift-workshop/",
    "engine": "assembly"
  },
  {
    "slug": "pattern-path",
    "title": "번갈아 꽃길",
    "age": "5–7세와 함께",
    "ageMin": 5,
    "ageMax": 7,
    "category": "모양·분류·퍼즐",
    "description": "번갈아 놓인 도형의 순서를 살펴보고 다음 빈칸을 채워요.",
    "preview": {
      "engine": "choice",
      "variant": "pattern",
      "params": {
        "motif": "circle"
      },
      "presentation": {
        "symbol": "",
        "detail": "도형의 반복 규칙"
      }
    },
    "href": "pattern-path/",
    "engine": "choice"
  },
  {
    "slug": "word-leaves",
    "title": "낱말 잎사귀",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "나무·꽃·잎 그림을 보고 한글 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "나무",
            "symbol": "🌳"
          },
          {
            "word": "꽃",
            "symbol": "🌼"
          },
          {
            "word": "잎",
            "symbol": "🍃"
          }
        ]
      },
      "presentation": {
        "symbol": "🌳",
        "detail": "나무·꽃·잎"
      }
    },
    "href": "word-leaves/",
    "engine": "words"
  },
  {
    "slug": "word-basket",
    "title": "낱말 열매 바구니",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "사과·배·포도 그림을 보고 한글 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "사과",
            "symbol": "🍎"
          },
          {
            "word": "배",
            "symbol": "🍐"
          },
          {
            "word": "포도",
            "symbol": "🍇"
          }
        ]
      },
      "presentation": {
        "symbol": "🍎",
        "detail": "사과·배·포도"
      }
    },
    "href": "word-basket/",
    "engine": "words"
  },
  {
    "slug": "english-garden",
    "title": "영어 정원 산책",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "tree·flower·sun 그림을 보고 영어 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "tree",
            "symbol": "🌳"
          },
          {
            "word": "flower",
            "symbol": "🌼"
          },
          {
            "word": "sun",
            "symbol": "☀️"
          }
        ]
      },
      "presentation": {
        "symbol": "🌳",
        "detail": "tree·flower·sun"
      }
    },
    "href": "english-garden/",
    "engine": "words"
  },
  {
    "slug": "word-picnic",
    "title": "그림 낱말 소풍",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "책·공·가방 그림을 보고 한글 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "책",
            "symbol": "📖"
          },
          {
            "word": "공",
            "symbol": "⚽"
          },
          {
            "word": "가방",
            "symbol": "🎒"
          }
        ]
      },
      "presentation": {
        "symbol": "📖",
        "detail": "책·공·가방"
      }
    },
    "href": "word-picnic/",
    "engine": "words"
  },
  {
    "slug": "english-fruit",
    "title": "영어 열매 친구",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "apple·banana·grape 그림을 보고 영어 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "apple",
            "symbol": "🍎"
          },
          {
            "word": "banana",
            "symbol": "🍌"
          },
          {
            "word": "grape",
            "symbol": "🍇"
          }
        ]
      },
      "presentation": {
        "symbol": "🍎",
        "detail": "apple·banana·grape"
      }
    },
    "href": "english-fruit/",
    "engine": "words"
  },
  {
    "slug": "english-sky",
    "title": "영어 하늘 엽서",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "sun·moon·star 그림을 보고 영어 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "sun",
            "symbol": "☀️"
          },
          {
            "word": "moon",
            "symbol": "🌙"
          },
          {
            "word": "star",
            "symbol": "⭐"
          }
        ]
      },
      "presentation": {
        "symbol": "☀️",
        "detail": "sun·moon·star"
      }
    },
    "href": "english-sky/",
    "engine": "words"
  },
  {
    "slug": "word-sky",
    "title": "하늘 낱말 편지",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "해·달·별 그림을 보고 한글 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "해",
            "symbol": "☀️"
          },
          {
            "word": "달",
            "symbol": "🌙"
          },
          {
            "word": "별",
            "symbol": "⭐"
          }
        ]
      },
      "presentation": {
        "symbol": "☀️",
        "detail": "해·달·별"
      }
    },
    "href": "word-sky/",
    "engine": "words"
  },
  {
    "slug": "word-sea",
    "title": "바다 낱말 산책",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "물고기·문어·게 그림을 보고 한글 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "물고기",
            "symbol": "🐟"
          },
          {
            "word": "문어",
            "symbol": "🐙"
          },
          {
            "word": "게",
            "symbol": "🦀"
          }
        ]
      },
      "presentation": {
        "symbol": "🐟",
        "detail": "물고기·문어·게"
      }
    },
    "href": "word-sea/",
    "engine": "words"
  },
  {
    "slug": "word-animal",
    "title": "동물 낱말 모임",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "고양이·토끼·새 그림을 보고 한글 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "고양이",
            "symbol": "🐈"
          },
          {
            "word": "토끼",
            "symbol": "🐇"
          },
          {
            "word": "새",
            "symbol": "🐦"
          }
        ]
      },
      "presentation": {
        "symbol": "🐈",
        "detail": "고양이·토끼·새"
      }
    },
    "href": "word-animal/",
    "engine": "words"
  },
  {
    "slug": "word-day",
    "title": "일상 낱말 앨범",
    "age": "5–8세와 함께",
    "ageMin": 5,
    "ageMax": 8,
    "category": "낱말·읽기",
    "description": "우산·신발·모자 그림을 보고 한글 낱말을 골라 연결해요.",
    "preview": {
      "engine": "words",
      "variant": "match",
      "params": {
        "cards": [
          {
            "word": "우산",
            "symbol": "☂️"
          },
          {
            "word": "신발",
            "symbol": "👟"
          },
          {
            "word": "모자",
            "symbol": "🧢"
          }
        ]
      },
      "presentation": {
        "symbol": "☂️",
        "detail": "우산·신발·모자"
      }
    },
    "href": "word-day/",
    "engine": "words"
  },
  {
    "slug": "morning-path",
    "title": "아침 준비 산책",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "기지개부터 세수·옷 입기·인사까지, 아침의 네 걸음을 이어 봐요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "눈을 뜨고 기지개를 켜요",
          "세수를 해요",
          "편한 옷을 입어요",
          "아침 인사를 해요"
        ]
      },
      "presentation": {
        "symbol": "🌤️",
        "detail": "아침 준비"
      }
    },
    "href": "morning-path/",
    "engine": "routine"
  },
  {
    "slug": "fruit-table",
    "title": "과일 한 접시",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "손 씻기부터 준비된 과일 담기와 나누기까지 차례를 골라요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "손을 씻어요",
          "어른과 씻은 과일을 준비해요",
          "접시에 담아요",
          "함께 나눠요"
        ]
      },
      "presentation": {
        "symbol": "🍐",
        "detail": "과일 나눔"
      }
    },
    "href": "fruit-table/",
    "engine": "routine"
  },
  {
    "slug": "walk-ready",
    "title": "산책 준비 한 걸음",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "어른에게 말하고 모자와 신발을 챙겨 함께 나서는 순서를 살펴봐요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "어른에게 함께 가자고 말해요",
          "모자를 챙겨요",
          "신발을 신어요",
          "함께 문을 나서요"
        ]
      },
      "presentation": {
        "symbol": "🧢",
        "detail": "산책 준비"
      }
    },
    "href": "walk-ready/",
    "engine": "routine"
  },
  {
    "slug": "bus-greeting",
    "title": "버스 나들이 준비",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "어른과 기다리기·차례로 타기·앉기·함께 내리기의 흐름을 이어 봐요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "어른과 정류장에서 기다려요",
          "버스가 멈추면 차례로 타요",
          "자리에 앉아요",
          "도착하면 어른과 내려요"
        ]
      },
      "presentation": {
        "symbol": "🚌",
        "detail": "버스 나들이"
      }
    },
    "href": "bus-greeting/",
    "engine": "routine"
  },
  {
    "slug": "picnic-order",
    "title": "소풍 도시락 준비",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "손을 씻고 준비된 음식을 골라 담은 뒤 뚜껑을 닫는 순서예요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "손을 씻어요",
          "준비된 음식을 골라요",
          "도시락에 담아요",
          "뚜껑을 닫아요"
        ]
      },
      "presentation": {
        "symbol": "🧺",
        "detail": "도시락 준비"
      }
    },
    "href": "picnic-order/",
    "engine": "routine"
  },
  {
    "slug": "market-path",
    "title": "작은 장보기 수첩",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "필요한 물건을 생각하고 바구니를 챙겨 어른과 계산하는 차례를 골라요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "필요한 것을 살펴봐요",
          "바구니를 챙겨요",
          "필요한 물건을 담아요",
          "어른과 계산해요"
        ]
      },
      "presentation": {
        "symbol": "📝",
        "detail": "장보기 메모"
      }
    },
    "href": "market-path/",
    "engine": "routine"
  },
  {
    "slug": "tidy-path",
    "title": "장난감 쉼터",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "놀이를 마친 장난감을 모아 제자리에 놓고 바닥을 살펴봐요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "놀이를 마쳐요",
          "장난감을 모아요",
          "제자리에 놓아요",
          "빈 바닥을 살펴봐요"
        ]
      },
      "presentation": {
        "symbol": "🧸",
        "detail": "장난감 정리"
      }
    },
    "href": "tidy-path/",
    "engine": "routine"
  },
  {
    "slug": "meal-greeting",
    "title": "함께 먹는 시간",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "손 씻기와 자리 앉기부터 식사 후 정리까지 한 가지 흐름을 연습해요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "손을 씻어요",
          "자리에 앉아요",
          "천천히 먹어요",
          "그릇을 정리해요"
        ]
      },
      "presentation": {
        "symbol": "🍽️",
        "detail": "함께 식사"
      }
    },
    "href": "meal-greeting/",
    "engine": "routine"
  },
  {
    "slug": "basket-order",
    "title": "바구니 나들이",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "메모를 보고 장을 본 다음, 집에서 물건을 제자리에 놓는 흐름이에요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "장보기 메모를 봐요",
          "바구니에 담아요",
          "어른과 계산해요",
          "집에서 제자리에 놓아요"
        ]
      },
      "presentation": {
        "symbol": "🛒",
        "detail": "바구니 정리"
      }
    },
    "href": "basket-order/",
    "engine": "routine"
  },
  {
    "slug": "evening-path",
    "title": "저녁 쉼표",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "생활·순서",
    "description": "장난감 정리·씻기·잠옷 입기를 이어 놓고 편히 쉬는 시간에 닿아요.",
    "preview": {
      "engine": "routine",
      "variant": "order",
      "params": {
        "steps": [
          "장난감을 정리해요",
          "씻어요",
          "잠옷을 입어요",
          "편히 쉬어요"
        ]
      },
      "presentation": {
        "symbol": "🌙",
        "detail": "저녁 쉼표"
      }
    },
    "href": "evening-path/",
    "engine": "routine"
  },
  {
    "slug": "cozy-room",
    "title": "포근한 방 한 칸",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "의자·책·화분·쿠션을 여섯 자리에 놓아 나만의 방을 꾸며요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "room",
        "props": [
          {
            "label": "의자",
            "symbol": "🪑"
          },
          {
            "label": "책",
            "symbol": "📖"
          },
          {
            "label": "화분",
            "symbol": "🪴"
          },
          {
            "label": "쿠션",
            "symbol": "🟡"
          }
        ]
      },
      "presentation": {
        "symbol": "🪑",
        "detail": "의자 · 책"
      }
    },
    "href": "cozy-room/",
    "engine": "scene"
  },
  {
    "slug": "tiny-village",
    "title": "작은 마을 쉼터",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "나무·꽃·집·의자로 작은 마을의 쉼터 한 장면을 배치해요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "garden",
        "props": [
          {
            "label": "나무",
            "symbol": "🌳"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          },
          {
            "label": "집",
            "symbol": "🏠"
          },
          {
            "label": "의자",
            "symbol": "🪑"
          }
        ]
      },
      "presentation": {
        "symbol": "🌳",
        "detail": "나무 · 꽃"
      }
    },
    "href": "tiny-village/",
    "engine": "scene"
  },
  {
    "slug": "nature-shelf",
    "title": "자연 보물 선반",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "잎·조개·꽃·돌을 골라 자연에서 떠올린 소품 선반을 채워요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "잎",
            "symbol": "🍃"
          },
          {
            "label": "조개",
            "symbol": "🐚"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          },
          {
            "label": "돌",
            "symbol": "🪨"
          }
        ]
      },
      "presentation": {
        "symbol": "🍃",
        "detail": "잎 · 조개"
      }
    },
    "href": "nature-shelf/",
    "engine": "scene"
  },
  {
    "slug": "window-corner",
    "title": "창가의 작은 자리",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "창가를 상상하며 화분·책·의자·등을 원하는 자리에 놓아요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "room",
        "props": [
          {
            "label": "화분",
            "symbol": "🪴"
          },
          {
            "label": "책",
            "symbol": "📖"
          },
          {
            "label": "의자",
            "symbol": "🪑"
          },
          {
            "label": "등",
            "symbol": "💡"
          }
        ]
      },
      "presentation": {
        "symbol": "🪴",
        "detail": "화분 · 책"
      }
    },
    "href": "window-corner/",
    "engine": "scene"
  },
  {
    "slug": "block-corner",
    "title": "조각 마을 구상",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "집·나무·다리·꽃 소품으로 한 장의 마을 구상을 만들어요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "집",
            "symbol": "🏠"
          },
          {
            "label": "나무",
            "symbol": "🌳"
          },
          {
            "label": "다리",
            "symbol": "🌉"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          }
        ]
      },
      "presentation": {
        "symbol": "🏠",
        "detail": "집 · 나무"
      }
    },
    "href": "block-corner/",
    "engine": "scene"
  },
  {
    "slug": "ribbon-studio",
    "title": "리본 빛깔 공방",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "리본·빗·모자·꽃을 놓으며 나만의 소품 작업대를 꾸며요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "리본",
            "symbol": "🎀"
          },
          {
            "label": "빗",
            "symbol": "🪮"
          },
          {
            "label": "모자",
            "symbol": "🧢"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          }
        ]
      },
      "presentation": {
        "symbol": "🎀",
        "detail": "리본 · 빗"
      }
    },
    "href": "ribbon-studio/",
    "engine": "scene"
  },
  {
    "slug": "garden-corner",
    "title": "뜰 안의 작은 쉼터",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "나무·꽃·화분·의자를 골라 정원의 여섯 자리를 채워요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "garden",
        "props": [
          {
            "label": "나무",
            "symbol": "🌳"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          },
          {
            "label": "물뿌리개",
            "symbol": "🪴"
          },
          {
            "label": "의자",
            "symbol": "🪑"
          }
        ]
      },
      "presentation": {
        "symbol": "🌳",
        "detail": "나무 · 꽃"
      }
    },
    "href": "garden-corner/",
    "engine": "scene"
  },
  {
    "slug": "celebration-table",
    "title": "누구나의 축하 식탁",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "꽃·컵·접시·선물을 배치해 누구나 함께하는 축하 자리를 만들어요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "table",
        "props": [
          {
            "label": "꽃",
            "symbol": "🌼"
          },
          {
            "label": "컵",
            "symbol": "🥛"
          },
          {
            "label": "접시",
            "symbol": "🍽️"
          },
          {
            "label": "선물",
            "symbol": "🎁"
          }
        ]
      },
      "presentation": {
        "symbol": "🌼",
        "detail": "꽃 · 컵"
      }
    },
    "href": "celebration-table/",
    "engine": "scene"
  },
  {
    "slug": "little-library",
    "title": "작은 도서 쉼터",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "책·의자·등·화분을 놓아 읽고 쉬는 작은 공간을 꾸며요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "room",
        "props": [
          {
            "label": "책",
            "symbol": "📚"
          },
          {
            "label": "의자",
            "symbol": "🪑"
          },
          {
            "label": "등",
            "symbol": "💡"
          },
          {
            "label": "화분",
            "symbol": "🪴"
          }
        ]
      },
      "presentation": {
        "symbol": "📚",
        "detail": "책 · 의자"
      }
    },
    "href": "little-library/",
    "engine": "scene"
  },
  {
    "slug": "play-corner",
    "title": "우리의 놀이 자리",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "공·인형·책·블록 소품을 골라 놀이방 한 장면을 배치해요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "room",
        "props": [
          {
            "label": "공",
            "symbol": "⚽"
          },
          {
            "label": "곰 인형",
            "symbol": "🧸"
          },
          {
            "label": "책",
            "symbol": "📖"
          },
          {
            "label": "블록",
            "symbol": "🟦"
          }
        ]
      },
      "presentation": {
        "symbol": "⚽",
        "detail": "공 · 곰 인형"
      }
    },
    "href": "play-corner/",
    "engine": "scene"
  },
  {
    "slug": "neighbor-table",
    "title": "이웃과 나눔 식탁",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "사과·빵·컵·꽃을 식탁에 놓아 함께 나누는 자리를 상상해요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "table",
        "props": [
          {
            "label": "사과",
            "symbol": "🍎"
          },
          {
            "label": "빵",
            "symbol": "🍞"
          },
          {
            "label": "컵",
            "symbol": "🥛"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          }
        ]
      },
      "presentation": {
        "symbol": "🍎",
        "detail": "사과 · 빵"
      }
    },
    "href": "neighbor-table/",
    "engine": "scene"
  },
  {
    "slug": "pattern-tray",
    "title": "색과 무늬 소품함",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "네 가지 색의 무늬 소품을 여섯 자리에 놓아 색 배치를 살펴봐요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "노랑 무늬",
            "symbol": "🟡"
          },
          {
            "label": "파랑 무늬",
            "symbol": "🟦"
          },
          {
            "label": "초록 무늬",
            "symbol": "🟢"
          },
          {
            "label": "보라 무늬",
            "symbol": "🟪"
          }
        ]
      },
      "presentation": {
        "symbol": "🟡",
        "detail": "노랑 무늬 · 파랑 무늬"
      }
    },
    "href": "pattern-tray/",
    "engine": "scene"
  },
  {
    "slug": "family-corner",
    "title": "함께 쉬는 거실",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "의자·쿠션·책·화분의 위치를 바꿔 쉬는 거실을 구성해요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "room",
        "props": [
          {
            "label": "의자",
            "symbol": "🪑"
          },
          {
            "label": "쿠션",
            "symbol": "🟡"
          },
          {
            "label": "책",
            "symbol": "📚"
          },
          {
            "label": "화분",
            "symbol": "🪴"
          }
        ]
      },
      "presentation": {
        "symbol": "🪑",
        "detail": "의자 · 쿠션"
      }
    },
    "href": "family-corner/",
    "engine": "scene"
  },
  {
    "slug": "park-corner",
    "title": "동네 공원 한 장면",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "나무와 꽃 사이에 의자·공을 놓으며 동네 공원 장면을 만들어요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "garden",
        "props": [
          {
            "label": "나무",
            "symbol": "🌳"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          },
          {
            "label": "의자",
            "symbol": "🪑"
          },
          {
            "label": "공",
            "symbol": "⚽"
          }
        ]
      },
      "presentation": {
        "symbol": "🌳",
        "detail": "나무 · 꽃"
      }
    },
    "href": "park-corner/",
    "engine": "scene"
  },
  {
    "slug": "story-corner",
    "title": "이야기 소품 상자",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "집·책·별·나무를 배치하고 그림에서 어떤 이야기가 떠오르는지 살펴봐요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "집",
            "symbol": "🏠"
          },
          {
            "label": "책",
            "symbol": "📖"
          },
          {
            "label": "별",
            "symbol": "⭐"
          },
          {
            "label": "나무",
            "symbol": "🌳"
          }
        ]
      },
      "presentation": {
        "symbol": "🏠",
        "detail": "집 · 책"
      }
    },
    "href": "story-corner/",
    "engine": "scene"
  },
  {
    "slug": "welcome-corner",
    "title": "반가운 손님 자리",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "컵·빵·꽃·의자를 골라 손님을 반기는 작은 자리를 꾸며요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "table",
        "props": [
          {
            "label": "컵",
            "symbol": "🥛"
          },
          {
            "label": "빵",
            "symbol": "🍞"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          },
          {
            "label": "의자",
            "symbol": "🪑"
          }
        ]
      },
      "presentation": {
        "symbol": "🥛",
        "detail": "컵 · 빵"
      }
    },
    "href": "welcome-corner/",
    "engine": "scene"
  },
  {
    "slug": "cape-studio",
    "title": "상상 소품 작업실",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "모자·리본·별·가방을 놓아 상상 속 소품 작업실을 만들어요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "모자",
            "symbol": "🧢"
          },
          {
            "label": "리본",
            "symbol": "🎀"
          },
          {
            "label": "별",
            "symbol": "⭐"
          },
          {
            "label": "가방",
            "symbol": "🎒"
          }
        ]
      },
      "presentation": {
        "symbol": "🧢",
        "detail": "모자 · 리본"
      }
    },
    "href": "cape-studio/",
    "engine": "scene"
  },
  {
    "slug": "color-display",
    "title": "빛깔 전시 한 칸",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "노랑·파랑·초록·보라 소품을 놓아 작은 색 전시를 구성해요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "노랑 그림",
            "symbol": "🟡"
          },
          {
            "label": "파랑 그림",
            "symbol": "🟦"
          },
          {
            "label": "초록 그림",
            "symbol": "🟢"
          },
          {
            "label": "보라 그림",
            "symbol": "🟪"
          }
        ]
      },
      "presentation": {
        "symbol": "🟡",
        "detail": "노랑 그림 · 파랑 그림"
      }
    },
    "href": "color-display/",
    "engine": "scene"
  },
  {
    "slug": "shared-playroom",
    "title": "함께 노는 작은 방",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "책·공·인형·화분의 위치를 고르며 함께 노는 방을 꾸며요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "room",
        "props": [
          {
            "label": "책",
            "symbol": "📖"
          },
          {
            "label": "공",
            "symbol": "⚽"
          },
          {
            "label": "인형",
            "symbol": "🧸"
          },
          {
            "label": "화분",
            "symbol": "🪴"
          }
        ]
      },
      "presentation": {
        "symbol": "📖",
        "detail": "책 · 공"
      }
    },
    "href": "shared-playroom/",
    "engine": "scene"
  },
  {
    "slug": "accessory-shelf",
    "title": "누구나의 소품 선반",
    "age": "4–8세와 함께",
    "ageMin": 4,
    "ageMax": 8,
    "category": "공간·소품 창작",
    "description": "리본·모자·가방·꽃을 원하는 순서와 위치로 선반에 놓아요.",
    "preview": {
      "engine": "scene",
      "variant": "compose",
      "params": {
        "backdrop": "studio",
        "props": [
          {
            "label": "리본",
            "symbol": "🎀"
          },
          {
            "label": "모자",
            "symbol": "🧢"
          },
          {
            "label": "가방",
            "symbol": "🎒"
          },
          {
            "label": "꽃",
            "symbol": "🌼"
          }
        ]
      },
      "presentation": {
        "symbol": "🎀",
        "detail": "리본 · 모자"
      }
    },
    "href": "accessory-shelf/",
    "engine": "scene"
  }
];
