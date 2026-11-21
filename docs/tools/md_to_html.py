#!/usr/bin/env python3
"""docs/ 아래 모든 문서 .md -> 동일 내용의 *.html 변환기.

표준 라이브러리만 사용한다(외부 패키지 설치 불필요, 오프라인에서도 실행 가능).
`superb-lotto-devel-python` 저장소의 `docs/tools/md_to_html.py`를 이식하고(2026-10-10) 브랜드 문구,
테마 저장 키, 흐름 다이어그램 stage 를 이 저장소(studio-boos-playstore) 기준으로 바꿨다.

출력 HTML 은 spring.io/guides 룩앤필을 따른다(2026-09-24, 브랜드 요소는 쓰지 않음).
구성은 sticky 헤더(브랜드 · 문서 탭 · 목차/PDF · ⚙ 설정) → 히어로(제목 아이콘 ·
제목 · 머리말) → 투톤 그린 바 → 본문(탭별 `On this page` 사이드바 + 콘텐츠)이다. 헤더·히어로·본문은
최대 폭 제한 없이 화면 전체 폭을 쓰고, 좌우 여백은 `--gutter`(화면 폭 비례)로 둔다.
우측 상단 목차·PDF·⚙ 설정 버튼은 문서 탭보다 작게(기존 대비 약 1/2) 둔다.
기준은 `GLANCE.md` `HTML 레이아웃 표준`을 따른다.
⚙ 설정 버튼은 보기 설정 레이어(팝오버)를 열어 주간/야간 · 컬러 스킨(기본 Spring.io 그린 · 봄 ·
여름 · 가을 · 겨울) · 본문 글자 크기(12~20px)를 고르게 하고, 선택은 localStorage 에 기억한다.
주간/야간은 `prefers-color-scheme` 을 기본으로 따른다. 보기 설정의 배치·구성·저장 키·스킨 값은
`GLANCE.md` `HTML 보기 설정 표준`이 정본이며, 이 스크립트를 바꾸면 그 표준도 같은 작업에서 현행화한다. 헤더는 `position:sticky` 라 좁은 폭에서도 본문을 덮지 않는다(`fixed` + 고정
padding 조합 금지). 1024px 에서 사이드바를 칩 목록으로, 900px 에서 탭 줄을 둘째 줄
가로 스크롤로, 640px 에서 히어로를 세로 배치로 바꾼다. 표는 `.table-wrap` 이 가로
스크롤하며 양 끝 그림자로 잘린 열을 표시하고, 모바일에서는 열 최소 폭을 둔다.
이 스크립트가 다루는 마크다운 문법은 이 저장소의 `docs/guide/*.md`가 실제로
쓰는 범위(헤더, 표, 목록, 코드펜스, 굵게/인라인코드/링크, 수평선)로 한정한다.
그 밖의 마크다운 문법(블록인용, 각주 등)은 이 저장소 문서에서 쓰지 않으므로
지원하지 않는다.

사용법:
  python3 docs/tools/md_to_html.py docs/guide/guide-content-review.md
  python3 docs/tools/md_to_html.py --all      # docs/ 아래 모든 문서 .md 전체
"""
from __future__ import annotations

import argparse
import html
import os
import re
import sys
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent
GUIDE_DIR = DOCS_DIR / "guide"
# --all 대상: docs/ 아래 모든 문서 .md(guide·plan·issue·prompt·review·operations 등 전 경로).
# 코드/캐시 디렉터리만 제외하며, 새 문서 디렉터리는 목록 관리 없이 자동 포함된다.
EXCLUDE_DIR_NAMES = {"tools", "__pycache__", ".git"}


def discover_all_md() -> list:
    """docs/ 아래(코드/캐시 디렉터리 제외) 모든 .md 를 깊이 무관하게 모은다."""
    targets = []
    for p in sorted(DOCS_DIR.rglob("*.md")):
        if any(part in EXCLUDE_DIR_NAMES for part in p.relative_to(DOCS_DIR).parts):
            continue
        targets.append(p)
    return targets

INLINE_CODE_RE = re.compile(r"`([^`]+)`")
BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
HEADER_RE = re.compile(r"^(#{1,6})\s+(.*)$")
CODE_FENCE_RE = re.compile(r"^```(\w*)\s*$")
HR_RE = re.compile(r"^-{3,}\s*$")
LIST_ITEM_RE = re.compile(r"^(\s*)([-*]|\d+\.)\s+(.*)$")
TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$")

CALLOUT_PREFIXES = [
    ("위험/확인", "danger-box"),
    ("위험", "danger-box"),
    ("경고", "danger-box"),
    ("주의사항", "decision"),
    ("주의", "decision"),
    ("확인 필요", "info-box"),
    ("참고", "info-box"),
]

# 콜아웃 라벨 아이콘 — 문서 작성 스타일 표준(GLANCE.md `문서 작성 스타일 표준`)과 같은 값이다.
# MD 원문은 `주의: ⚠️ 본문` 처럼 라벨 뒤에 아이콘을 둔다(노션 붙여넣기에서도 보이도록).
# HTML 은 아이콘을 라벨(h4)로 올리고 본문 앞의 같은 아이콘은 지워 중복 표시를 막는다.
CALLOUT_ICONS = {
    "위험/확인": "🚨",
    "위험": "🚨",
    "경고": "🚨",
    "주의사항": "⚠️",
    "주의": "⚠️",
    "확인 필요": "❓",
    "참고": "💡",
}
LEADING_ICON_RE = re.compile(r"^[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u2190-\u21FF]\ufe0f?\s*")


def callout_label(prefix: str) -> str:
    icon = CALLOUT_ICONS.get(prefix)
    return f"{icon} {prefix}" if icon else prefix

GUIDE_LINK_RE = re.compile(r"^([A-Za-z0-9_-]+)\.md(#.*)?$")

FOOTER_RE = re.compile(r"^🙏.*감사합니다!?$")

# 우측 상단 ⚙ 설정 레이어(보기 설정) — 컬러 스킨(키, 라벨, 점 색)과 글자 크기 범위(본문 px).
# 기준은 GLANCE.md `HTML 보기 설정 표준`이다. 스킨을 추가·변경하면 이 목록과 CSS `:root[data-skin="…"]`
# 블록(주간/야간 --sk-* 12개)을 함께 고치고, 표준 문서의 스킨 표도 같은 작업에서 현행화한다.
# 첫 번째 항목(green)은 기본 스킨이며 data-skin 속성 없이 :root 기본 토큰으로 표현한다.
SKINS = [
    ("green", "기본 (Spring.io 그린)", "#6db33f"),
    ("spring", "봄 (벚꽃 핑크)", "#e0607e"),
    ("summer", "여름 (바다 블루)", "#1e9bd7"),
    ("autumn", "가을 (단풍 오렌지)", "#d9731f"),
    ("winter", "겨울 (설원 인디고)", "#4a5fc1"),
]
FONT_BASE, FONT_MIN, FONT_MAX = 15, 12, 20
SKIN_KEYS_JS = ",".join(f"'{key}'" for key, _, _ in SKINS[1:])   # 첫 페인트 전 복원 허용 목록


def esc(text: str) -> str:
    return html.escape(text, quote=False)


def slugify(text: str, seen: dict) -> str:
    plain = re.sub(r"`([^`]+)`", r"\1", text)
    plain = re.sub(r"[^0-9A-Za-z가-힣]+", "-", plain).strip("-").lower()
    if not plain:
        plain = "section"
    if plain in seen:
        seen[plain] += 1
        plain = f"{plain}-{seen[plain]}"
    else:
        seen[plain] = 0
    return plain


def rewrite_href(url: str) -> str:
    m = GUIDE_LINK_RE.match(url)
    if m:
        return f"{m.group(1)}.html{m.group(2) or ''}"
    return url


def inline(text: str) -> str:
    text = esc(text)
    codes = []

    def stash(m):
        codes.append(m.group(1))
        return f"\x00C{len(codes) - 1}\x00"

    text = INLINE_CODE_RE.sub(stash, text)
    text = BOLD_RE.sub(r"<b>\1</b>", text)

    def link_sub(m):
        label, url = m.group(1), m.group(2)
        href = rewrite_href(url)
        attrs = ' target="_blank" rel="noopener"' if href.startswith("http") else ""
        return f'<a href="{href}"{attrs}>{label}</a>'

    text = LINK_RE.sub(link_sub, text)
    for i, c in enumerate(codes):
        text = text.replace(f"\x00C{i}\x00", f'<code class="inline">{c}</code>')
    return text


def render_table(rows: list) -> str:
    cells = []
    for row in rows:
        row = row.strip()
        if row.startswith("|"):
            row = row[1:]
        if row.endswith("|"):
            row = row[:-1]
        cells.append([c.strip() for c in row.split("|")])
    header, rest = cells[0], cells[1:]
    if rest and TABLE_SEP_RE.match("|".join(rest[0])):
        rest = rest[1:]
    out = ['<div class="table-wrap"><table class="comp-table">', "<tr>"]
    out += [f"<th>{inline(c)}</th>" for c in header]
    out.append("</tr>")
    for row in rest:
        out.append("<tr>")
        out += [f"<td>{inline(c)}</td>" for c in row]
        out.append("</tr>")
    out.append("</table></div>")
    return "".join(out)


# ── 흐름 다이어그램(```flow) ─────────────────────────────────────────────
# MD 에서는 텍스트 흐름도로 읽히고(노션 붙여넣기 호환), HTML 에서는 반응형 박스·화살표로 그린다.
#   [stage] 제목 | 부가1 | 부가2   노드. stage = store · review · spec · code · web · test · log (색·배지 결정)
#                                  step 은 작업 절차용. [stage:배지] 로 배지 문구 지정
#   --> 라벨 | 부가                화살표(일반).  ==> 는 운영 영향(파괴적) 화살표로 강조한다
#   (빈 줄)                        다음 줄(row)로 넘긴다 — 분기·역방향 흐름을 줄로 나눠 그린다
#   ※ 설명                         다이어그램 아래 캡션
FLOW_STAGES = {
    "store": "GOOGLE PLAY", "review": "REVIEW", "spec": "SPEC", "code": "CODE",
    "web": "WEB · LOCAL", "test": "TEST", "log": "LOG · MD", "step": "STEP",
}
# stage -> 색 클래스(st-org · st-mig · st-dev · st-prd · st-file)
FLOW_COLOR = {"store": "org", "review": "file", "spec": "mig", "code": "dev", "web": "prd",
              "test": "mig", "log": "file", "step": "mig"}
FLOW_NODE_RE = re.compile(r"^\[(\w+)(?::([^\]]+))?\]\s*(.*)$")


def flow_inline(text: str) -> str:
    """다이어그램용 인라인 — 좁은 노드에서 식별자가 글자 중간에서 끊기지 않도록 `_`·`.` 뒤에서만 줄바꿈한다."""
    html_ = inline(text)
    return re.sub(r'(<code class="inline">)(.*?)(</code>)',
                  lambda m: m.group(1) + re.sub(r'([_.])', r'\1<wbr>', m.group(2)) + m.group(3), html_)


def render_flow(lines: list) -> str:
    rows, notes = [[]], []
    for raw in lines:
        s = raw.strip()
        if not s:
            if rows[-1]:
                rows.append([])
            continue
        if s.startswith("※"):
            notes.append(s)
            continue
        m = FLOW_NODE_RE.match(s)
        if m:
            parts = [p.strip() for p in m.group(3).split(" | ")]
            rows[-1].append(("node", (m.group(1).lower(), m.group(2)), parts))
            continue
        if s.startswith("-->") or s.startswith("==>"):
            parts = [p.strip() for p in s[3:].split(" | ")]
            rows[-1].append(("arrow", "danger" if s.startswith("==>") else "normal", parts))
            continue
        notes.append(s)                      # 형식 밖 줄은 캡션으로 보존(내용 누락 방지)
    out = ['<figure class="flow" role="img">']
    for row in rows:
        if not row:
            continue
        nodes = sum(1 for k, _, _ in row if k == "node")
        out.append(f'<div class="flow-row n{min(nodes, 5)}">')
        for kind, key, parts in row:
            if kind == "node":
                key, custom = key
                badge = custom.strip() if custom else FLOW_STAGES.get(key, key.upper())
                key = FLOW_COLOR.get(key, key)
                subs = "".join(f'<div class="fnode-sub">{flow_inline(p)}</div>' for p in parts[1:])
                out.append(f'<div class="fnode st-{esc(key)}"><div class="fnode-badge">{esc(badge)}</div>'
                           f'<div class="fnode-title">{flow_inline(parts[0])}</div>{subs}</div>')
            else:
                label = flow_inline(parts[0]) if parts and parts[0] else ""
                subs = "".join(f'<div class="farrow-sub">{flow_inline(p)}</div>' for p in parts[1:])
                out.append(f'<div class="farrow fa-{key}"><div class="farrow-label">{label}</div>'
                           f'<div class="farrow-line" aria-hidden="true"></div>{subs}</div>')
        out.append("</div>")
    if notes:
        out.append('<figcaption>' + "<br>".join(flow_inline(n) for n in notes) + "</figcaption>")
    out.append("</figure>")
    return "".join(out)


def render_list(lines: list) -> str:
    items = []  # [indent, ordered, text] — text 는 이후 이어지는 줄바꿈(soft-wrap)로 보강됨
    for line in lines:
        m = LIST_ITEM_RE.match(line)
        if m:
            indent = len(m.group(1))
            marker = m.group(2)
            ordered = bool(re.match(r"^\d+\.$", marker))
            number = int(marker[:-1]) if ordered else None
            items.append([indent, ordered, m.group(3).strip(), number])
        elif items:
            # 마커 없는 들여쓰기 줄 = 앞 항목의 soft-wrap 이어짐
            items[-1][2] += " " + line.strip()

    def build(idx: int):
        base_indent = items[idx][0]
        ordered = items[idx][1]
        number = items[idx][3]
        if ordered:
            tag = "ol"
            out = [f'<ol start="{number}">' if number != 1 else "<ol>"]
        else:
            tag = "ul"
            out = ["<ul>"]
        while idx < len(items) and items[idx][0] == base_indent:
            _, _, text, _ = items[idx]
            idx += 1
            li = f"<li>{inline(text)}"
            if idx < len(items) and items[idx][0] > base_indent:
                sub_html, idx = build(idx)
                li += sub_html
            li += "</li>"
            out.append(li)
        out.append(f"</{tag}>")
        return "".join(out), idx

    rendered, _ = build(0)
    return rendered


def render_para(lines: list):
    """일반 문단은 HTML 문자열을 반환한다.

    문단 전체가 `주의:`처럼 콜아웃 라벨 하나뿐이면(본문 없음), 뒤따르는 목록을
    같은 박스에 합치기 위해 (label, css_class) 튜플을 반환한다 — 호출부에서
    다음 토큰이 목록인지 보고 처리한다.
    """
    text = " ".join(l.strip() for l in lines)
    for prefix, css_class in CALLOUT_PREFIXES:
        if text.startswith(prefix + ":") or text.startswith(prefix + " :"):
            body = text.split(":", 1)[1].strip()
            icon = CALLOUT_ICONS.get(prefix)
            if icon and body.startswith(icon.rstrip("\ufe0f")):  # 라벨과 같은 아이콘만 지운다
                body = LEADING_ICON_RE.sub("", body, count=1).strip()
            if not body:  # `주의:` 또는 `주의: ⚠️` 만 있는 라벨 — 뒤 목록과 합친다
                return (callout_label(prefix), css_class)
            return (
                f'<div class="{css_class}"><h4>{esc(callout_label(prefix))}</h4>{inline(body)}</div>'
            )
    return f"<p>{inline(text)}</p>"


def parse_meta(lines: list):
    meta = {}
    i = 0
    while i < len(lines):
        m = re.match(r"^(작성일|작성자)\s*:\s*(.*)$", lines[i].strip())
        if m:
            meta[m.group(1)] = m.group(2).strip()
            i += 1
            continue
        if lines[i].strip() == "" and meta:
            i += 1
            continue
        if lines[i].strip() == "" and not meta:
            i += 1
            continue
        break
    return meta, lines[i:]


def convert(md_text: str, doc_title_fallback: str):
    lines = md_text.splitlines()
    meta, lines = parse_meta(lines)

    title = doc_title_fallback
    if lines:
        m = HEADER_RE.match(lines[0])
        if m and len(m.group(1)) == 1:
            title = m.group(2).strip()
            lines = lines[1:]

    seen_slugs: dict = {}
    tabs: list = []
    current = None
    footer_html = ""
    pending = {"label": None, "cls": None}

    def ensure_tab(default_label="개요"):
        nonlocal current
        if current is None:
            current = {"id": "top", "label": default_label, "buf": [], "subheads": []}
            tabs.append(current)

    def flush_pending():
        nonlocal pending
        if pending["label"] is not None:
            ensure_tab()
            current["buf"].append(
                f'<div class="{pending["cls"]}"><h4>{esc(pending["label"])}</h4></div>'
            )
            pending = {"label": None, "cls": None}

    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if line.strip() == "":
            i += 1
            continue

        if pending["label"] is not None and not LIST_ITEM_RE.match(line):
            flush_pending()

        m = CODE_FENCE_RE.match(line)
        if m:
            lang = m.group(1)
            i += 1
            buf = []
            while i < n and lines[i].strip() != "```":
                buf.append(lines[i])
                i += 1
            i += 1
            if lang == "flow":
                ensure_tab()
                current["buf"].append(render_flow(buf))
                continue
            label = f'<span class="label">{esc(lang)}</span>' if lang else ""
            # 복사 버튼은 <pre> 밖에 둔다 — 복사 대상은 코드 본문뿐이다(언어 라벨 제외)
            code_html = (f'<div class="code-wrap"><pre class="code-block">{label}{esc(chr(10).join(buf))}</pre>'
                         f'<button class="copy-btn" type="button" onclick="copyCode(this)" '
                         f'aria-label="코드 복사" title="클립보드에 복사">📋 <span>복사</span></button></div>')
            ensure_tab()
            current["buf"].append(code_html)
            continue

        m = HEADER_RE.match(line)
        if m:
            level = len(m.group(1))
            text = m.group(2).strip()
            slug = slugify(text, seen_slugs)
            if level == 2:
                current = {"id": slug, "label": re.sub(r"`([^`]+)`", r"\1", text), "buf": [], "subheads": []}
                tabs.append(current)
                current["buf"].append(f'<h2 id="{slug}">{inline(text)}</h2>')
            else:
                ensure_tab()
                current["buf"].append(f'<h{level} id="{slug}">{inline(text)}</h{level}>')
                if level == 3:
                    current["subheads"].append((slug, re.sub(r"`([^`]+)`", r"\1", text)))
            i += 1
            continue

        if HR_RE.match(line):
            i += 1
            continue

        if line.lstrip().startswith("|"):
            buf = []
            while i < n and lines[i].lstrip().startswith("|"):
                buf.append(lines[i])
                i += 1
            ensure_tab()
            current["buf"].append(render_table(buf))
            continue

        if LIST_ITEM_RE.match(line):
            buf = []
            while i < n and lines[i].strip() != "" and not (
                HEADER_RE.match(lines[i])
                or CODE_FENCE_RE.match(lines[i])
                or lines[i].lstrip().startswith("|")
                or HR_RE.match(lines[i])
                or FOOTER_RE.match(lines[i].strip())
            ):
                buf.append(lines[i])
                i += 1
            list_html = render_list(buf)
            ensure_tab()
            if pending["label"] is not None:
                current["buf"].append(
                    f'<div class="{pending["cls"]}"><h4>{esc(pending["label"])}</h4>{list_html}</div>'
                )
                pending = {"label": None, "cls": None}
            else:
                current["buf"].append(list_html)
            continue

        if FOOTER_RE.match(line.strip()):
            footer_html = esc(line.strip())
            i += 1
            continue

        buf = [line]
        i += 1
        while i < n and lines[i].strip() != "" and not (
            HEADER_RE.match(lines[i])
            or CODE_FENCE_RE.match(lines[i])
            or LIST_ITEM_RE.match(lines[i])
            or lines[i].lstrip().startswith("|")
            or HR_RE.match(lines[i])
            or FOOTER_RE.match(lines[i].strip())
        ):
            buf.append(lines[i])
            i += 1
        ensure_tab()
        result = render_para(buf)
        if isinstance(result, tuple):
            pending = {"label": result[0], "cls": result[1]}
        else:
            current["buf"].append(result)

    flush_pending()
    return title, meta, tabs, footer_html


def render_page(title: str, meta: dict, tabs: list, footer_html: str,
                index_href: str = "guide.html") -> str:
    """spring.io/guides 룩앤필(그린 포인트 · 헤더/히어로 · 투톤 바 · 사이드바)을 따르는 페이지.

    브랜드 요소(로고·명칭)는 쓰지 않고 레이아웃 · 색 · 타이포그래피만 참고한다.
    주간/야간은 OS 설정(prefers-color-scheme)을 기본으로 따르고, 헤더 스위치로 바꾸면
    localStorage 에 기억한다(저장 불가 환경에서도 렌더는 정상). 인쇄는 항상 주간 색이다.
    외부 폰트는 추가하지 않는다 — 오프라인에서도 시스템 폰트 스택으로 같은 모양이 나온다.
    """
    meta_line = " · ".join(f"{k}: {v}" for k, v in meta.items())
    skin_dots = "".join(
        f'<button class="skin-dot" type="button" role="radio" aria-checked="false" data-skin="{key}" '
        f'style="--dot:{color}" aria-label="{label}" title="{label}" onclick="setSkin(\'{key}\')"></button>'
        for key, label, color in SKINS
    )
    m = LEADING_ICON_RE.match(title)
    hero_icon = title[: m.end()].strip() if m else "📄"
    hero_title = title[m.end():].strip() if m else title

    nav_buttons = []
    sections = []
    for idx, tab in enumerate(tabs):
        active = " active" if idx == 0 else ""
        nav_buttons.append(
            f'<button class="nav-link{active}" onclick="show(event,\'{tab["id"]}\')">{esc(tab["label"])}</button>'
        )
        body = "".join(tab["buf"])
        if len(tab["subheads"]) >= 2:
            links = "".join(
                f'<a href="#{s}" class="side-link">{esc(t)}</a>' for s, t in tab["subheads"]
            )
            sections.append(
                f'<div id="sec-{tab["id"]}" class="section has-side{active}">'
                f'<aside class="side"><div class="side-title">On this page</div>{links}</aside>'
                f'<div class="content">{body}</div></div>'
            )
        else:
            sections.append(
                f'<div id="sec-{tab["id"]}" class="section{active}"><div class="content">{body}</div></div>'
            )

    footer_block = f'<div class="doc-footer">{footer_html}</div>' if footer_html else ""

    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>">
<title>{esc(hero_title)}</title>
<script>
/* 첫 페인트 전에 저장된 테마·컬러 스킨·글자 크기를 적용해 깜빡임을 막는다. 저장소 접근 실패는 무시한다. */
(function(){{try{{var r=document.documentElement,t=localStorage.getItem('boos-guide-theme');
if(t==='light'||t==='dark')r.setAttribute('data-theme',t);
var k=localStorage.getItem('boos-guide-skin');
if([{SKIN_KEYS_JS}].indexOf(k)>=0)r.setAttribute('data-skin',k);
var f=parseInt(localStorage.getItem('boos-guide-font'),10);
if(f>={FONT_MIN}&&f<={FONT_MAX})r.style.setProperty('--fz',f/{FONT_BASE});}}catch(e){{}}}})();
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css">
<style>
:root{{
  /* 컬러 스킨 기본값 = Spring.io 그린. 봄·여름·가을·겨울은 아래 [data-skin] 이 --sk-* 만 바꾼다 */
  --sk-accent:#6db33f; --sk-accent2:#86dc3d; --sk-hero-l:#e8efee; --sk-hero-d:#24292e;
  --sk-text-l:#3f7a1f; --sk-text-d:#86dc3d; --sk-soft-l:#eef6e8; --sk-soft-d:rgba(109,179,63,.14);
  --sk-ibg-l:#eef3ef; --sk-ibg-d:rgba(134,220,61,.12); --sk-itx-l:#335f1a; --sk-itx-d:#a6e36f;
  --fz:1;   /* 글자 크기 배율(본문 {FONT_BASE}px 기준) — 헤더 글자 크기 버튼이 바꾼다 */
  --bg:#ffffff; --bg-soft:#f7f8f8; --hero:var(--sk-hero-l); --header:#ffffff; --card:#ffffff;
  --border:#dfe3e3; --border-strong:#191e1e;
  --text:#191e1e; --text2:#4f5657; --text3:#7b8384;
  --accent:var(--sk-accent); --accent-2:var(--sk-accent2); --accent-text:var(--sk-text-l); --accent-soft:var(--sk-soft-l);
  --th:#f1f4f4; --code-bg:#1b1f23; --code-text:#e6e8e8; --inline-bg:var(--sk-ibg-l); --inline-text:var(--sk-itx-l);
  --warn:#b7791f; --warn-soft:#fdf6e7; --danger:#c0392b; --danger-soft:#fbeeee;
  --info:#2f6f8f; --info-soft:#eaf3f7; --shadow:0 1px 2px rgba(0,0,0,.06);
  --nav-h:64px; --radius:4px; --gutter:clamp(32px,3vw,64px);
  --font-head:'Montserrat','Metropolis','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif;
  --font-body:'Open Sans','Pretendard','Apple SD Gothic Neo','Malgun Gothic',-apple-system,'Segoe UI',system-ui,sans-serif;
  --font-mono:'D2Coding ligature','D2Coding','JetBrains Mono','SF Mono',Menlo,Consolas,monospace;
}}
@media (prefers-color-scheme:dark){{
  :root:not([data-theme="light"]){{
    --bg:#1b1f23; --bg-soft:#20252a; --hero:var(--sk-hero-d); --header:#1b1f23; --card:#20252a;
    --border:#343b41; --border-strong:#e6e8e8;
    --text:#f1f2f2; --text2:#bcc3c6; --text3:#8e979b;
    --accent-text:var(--sk-text-d); --accent-soft:var(--sk-soft-d);
    --th:#262c31; --code-bg:#121518; --inline-bg:var(--sk-ibg-d); --inline-text:var(--sk-itx-d);
    --warn:#e0b24f; --warn-soft:rgba(224,178,79,.12); --danger:#ef7a6d; --danger-soft:rgba(239,122,109,.12);
    --info:#6fb6d8; --info-soft:rgba(111,182,216,.12); --shadow:none;
  }}
}}
:root[data-theme="dark"]{{
  --bg:#1b1f23; --bg-soft:#20252a; --hero:var(--sk-hero-d); --header:#1b1f23; --card:#20252a;
  --border:#343b41; --border-strong:#e6e8e8;
  --text:#f1f2f2; --text2:#bcc3c6; --text3:#8e979b;
  --accent-text:var(--sk-text-d); --accent-soft:var(--sk-soft-d);
  --th:#262c31; --code-bg:#121518; --inline-bg:var(--sk-ibg-d); --inline-text:var(--sk-itx-d);
  --warn:#e0b24f; --warn-soft:rgba(224,178,79,.12); --danger:#ef7a6d; --danger-soft:rgba(239,122,109,.12);
  --info:#6fb6d8; --info-soft:rgba(111,182,216,.12); --shadow:none;
}}
/* 컬러 스킨 — 봄(벚꽃 핑크) · 여름(바다 블루) · 가을(단풍 오렌지) · 겨울(설원 인디고). 주간/야간 값을 함께 둔다 */
:root[data-skin="spring"]{{
  --sk-accent:#e0607e; --sk-accent2:#f4a6b8; --sk-hero-l:#fbecef; --sk-hero-d:#2a2326;
  --sk-text-l:#b03a5b; --sk-text-d:#f59ab0; --sk-soft-l:#fdeef2; --sk-soft-d:rgba(224,96,126,.14);
  --sk-ibg-l:#fcf0f3; --sk-ibg-d:rgba(245,154,176,.12); --sk-itx-l:#9c2f4f; --sk-itx-d:#f7b3c4;
}}
:root[data-skin="summer"]{{
  --sk-accent:#1e9bd7; --sk-accent2:#4fd1e8; --sk-hero-l:#e6f2f8; --sk-hero-d:#20282e;
  --sk-text-l:#146c99; --sk-text-d:#6cc8f0; --sk-soft-l:#e8f5fb; --sk-soft-d:rgba(30,155,215,.14);
  --sk-ibg-l:#ebf4f8; --sk-ibg-d:rgba(108,200,240,.12); --sk-itx-l:#0f5c85; --sk-itx-d:#8fd6f5;
}}
:root[data-skin="autumn"]{{
  --sk-accent:#d9731f; --sk-accent2:#f2b134; --sk-hero-l:#f6ece2; --sk-hero-d:#2a2520;
  --sk-text-l:#9c4f10; --sk-text-d:#f2a65a; --sk-soft-l:#fbf1e6; --sk-soft-d:rgba(217,115,31,.14);
  --sk-ibg-l:#f8f0e8; --sk-ibg-d:rgba(242,166,90,.12); --sk-itx-l:#8a4510; --sk-itx-d:#f5bb82;
}}
:root[data-skin="winter"]{{
  --sk-accent:#4a5fc1; --sk-accent2:#8fa8ec; --sk-hero-l:#e9ecf6; --sk-hero-d:#22252e;
  --sk-text-l:#34449a; --sk-text-d:#a3b4f5; --sk-soft-l:#eceffa; --sk-soft-d:rgba(74,95,193,.16);
  --sk-ibg-l:#eef0f8; --sk-ibg-d:rgba(163,180,245,.12); --sk-itx-l:#2f3d8a; --sk-itx-d:#b6c3f7;
}}
*{{box-sizing:border-box}}
html{{-webkit-text-size-adjust:100%;scroll-behavior:smooth}}
body{{margin:0;background:var(--bg);color:var(--text);font-family:var(--font-body);
  font-size:calc(15px*var(--fz));line-height:1.75;overflow-wrap:break-word;transition:background .2s,color .2s}}
a{{color:var(--accent-text)}}

/* ── 헤더: sticky 로 문서 흐름 안에 둔다(fixed + 고정 padding 은 좁은 폭에서 본문을 덮는다) ── */
.site-header{{position:sticky;top:0;z-index:100;background:var(--header);
  border-bottom:1px solid var(--border)}}
.header-inner{{display:flex;align-items:center;gap:20px;
  padding:0 var(--gutter);min-height:var(--nav-h);flex-wrap:nowrap}}
.brand{{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);
  font-family:var(--font-head);font-weight:800;font-size:19px;letter-spacing:-.2px;white-space:nowrap}}
.brand-mark{{width:30px;height:30px;border-radius:50%;background:var(--accent);display:grid;
  place-items:center;font-size:16px;line-height:1}}
.brand small{{font-weight:600;font-size:12.5px;color:var(--accent-text)}}
.nav-links{{display:flex;gap:2px;flex:1 1 0;flex-wrap:nowrap;min-width:0;overflow-x:auto;
  scrollbar-width:none;-ms-overflow-style:none}}
.nav-links::-webkit-scrollbar{{display:none}}
/* 탭이 많아도 헤더 버튼을 밀어내지 않는다 — 탭 영역만 가로 스크롤, 탭은 오른쪽 정렬 */
.nav-links>:first-child{{margin-left:auto}}
.nav-link{{border:none;background:transparent;color:var(--text);font-family:var(--font-head);
  font-weight:700;font-size:14px;padding:20px 12px 17px;cursor:pointer;white-space:nowrap;
  border-bottom:3px solid transparent}}
.nav-link:hover{{color:var(--accent-text)}}
.nav-link.active{{border-bottom-color:var(--accent);color:var(--accent-text)}}
/* 우측 상단 보조 기능(목차·PDF·주간/야간)은 탭보다 작게 둔다 — 글자는 가독 하한 10px */
.header-actions{{display:flex;align-items:center;gap:6px;flex-shrink:0}}
.hbtn{{border:1px solid var(--border);background:transparent;color:var(--text);font-family:var(--font-head);
  font-weight:700;font-size:10px;line-height:1.2;padding:3px 7px;border-radius:var(--radius);cursor:pointer;
  text-decoration:none;white-space:nowrap}}
.hbtn:hover{{border-color:var(--accent);color:var(--accent-text)}}
/* 주간/야간 스위치 — 트랙 위 노브가 좌(주간 ☀)↔우(야간 ☾)로 이동한다 */
.theme-switch{{position:relative;width:28px;height:14px;border-radius:7px;border:none;cursor:pointer;
  background:var(--border);padding:0;flex-shrink:0}}
.theme-switch .knob{{position:absolute;top:-2px;left:-2px;width:18px;height:18px;border-radius:50%;
  background:var(--text);color:var(--bg);display:grid;place-items:center;font-size:10px;
  transition:transform .2s ease;box-shadow:0 1px 3px rgba(0,0,0,.25)}}
.theme-switch[aria-checked="true"] .knob{{transform:translateX(14px)}}
.theme-switch:focus-visible,.nav-link:focus-visible,.hbtn:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
/* 보기 설정 — 우측 상단 ⚙ 설정 버튼이 레이어(팝오버)를 연다. 주간/야간 · 컬러 스킨 · 글자 크기를 담는다 */
.header-actions{{position:relative}}
.hbtn[aria-expanded="true"]{{border-color:var(--accent);color:var(--accent-text);background:var(--accent-soft)}}
.prefs-panel{{position:absolute;right:0;top:calc(100% + 10px);z-index:200;width:min(264px,calc(100vw - 32px));
  background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 16px 12px;
  box-shadow:0 10px 30px rgba(0,0,0,.18);font-family:var(--font-head)}}
.prefs-panel[hidden]{{display:none}}
.prefs-title{{font-weight:800;font-size:13px;margin:0 0 6px;color:var(--text)}}
.pref-row{{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;
  border-top:1px solid var(--border)}}
.pref-label{{font-weight:700;font-size:12px;color:var(--text2);white-space:nowrap}}
.pref-ctrl{{display:flex;align-items:center;gap:8px}}
.pref-note{{font-size:11px;color:var(--text3);white-space:nowrap}}
.skin-dots{{display:flex;gap:8px}}
.skin-dot{{width:18px;height:18px;border-radius:50%;border:none;padding:0;cursor:pointer;background:var(--dot);
  box-shadow:0 0 0 1px rgba(0,0,0,.12)}}
.skin-dot[aria-checked="true"]{{box-shadow:0 0 0 2px var(--card),0 0 0 3.5px var(--text)}}
.skin-dot:hover{{transform:scale(1.12)}}
.skin-name{{display:block;text-align:right;font-size:11px;color:var(--text3);margin-top:-4px;padding-bottom:6px}}
.font-btn{{border:1px solid var(--border);background:transparent;color:var(--text);font-family:var(--font-head);font-weight:700;
  font-size:12px;line-height:1;padding:5px 8px;border-radius:var(--radius);cursor:pointer;white-space:nowrap}}
.font-btn:hover{{border-color:var(--accent);color:var(--accent-text)}}
.font-btn:disabled{{opacity:.35;cursor:default;border-color:var(--border);color:var(--text)}}
.font-val{{font-weight:700;font-size:12px;color:var(--text);min-width:20px;text-align:center}}
.prefs-reset{{display:block;margin:4px 0 0 auto;border:none;background:transparent;color:var(--accent-text);
  font-family:var(--font-head);font-weight:700;font-size:11px;cursor:pointer;padding:4px 0}}
.skin-dot:focus-visible,.font-btn:focus-visible,.prefs-reset:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}

/* ── 히어로 + 투톤 그린 바 ── */
.hero{{background:var(--hero)}}
.hero-inner{{display:flex;align-items:center;gap:40px;padding:56px var(--gutter)}}
.hero-icon{{font-size:96px;line-height:1;flex-shrink:0;filter:drop-shadow(0 6px 10px rgba(0,0,0,.12))}}
.hero h1{{font-family:var(--font-head);font-weight:800;font-size:calc(40px*var(--fz));line-height:1.25;margin:0 0 12px;
  letter-spacing:-.5px}}
.hero .meta{{color:var(--text2);font-size:calc(15.5px*var(--fz));margin:0}}
.green-bar{{height:10px;background:linear-gradient(to right,var(--accent) 0 60%,var(--accent-2) 60% 100%)}}

/* ── 본문: 좌 사이드바(On this page) + 콘텐츠 — 최대 폭 제한 없이 화면 전체 폭을 쓴다 ── */
.wrap{{padding:40px var(--gutter) 80px}}
.section{{display:none}}.section.active{{display:block}}
.section.has-side.active{{display:grid;grid-template-columns:clamp(230px,16vw,300px) minmax(0,1fr);gap:clamp(40px,3vw,64px)}}
.side{{position:sticky;top:calc(var(--nav-h) + 20px);align-self:start;max-height:calc(100vh - var(--nav-h) - 40px);
  overflow:auto;border-right:1px solid var(--border);padding-right:18px}}
.side-title{{font-family:var(--font-head);font-weight:800;font-size:calc(15px*var(--fz));margin:0 0 12px}}
.side-link{{display:block;color:var(--text2);text-decoration:none;font-size:calc(13.5px*var(--fz));line-height:1.45;
  padding:7px 0 7px 12px;border-left:2px solid transparent}}
.side-link:hover{{color:var(--accent-text);border-left-color:var(--accent)}}
.content{{min-width:0}}
h2,h3,h4,h5,h6{{font-family:var(--font-head);scroll-margin-top:calc(var(--nav-h) + 16px)}}
h2{{font-size:calc(26px*var(--fz));font-weight:800;margin:0 0 20px;padding-bottom:14px;border-bottom:1px solid var(--border)}}
h3{{font-size:calc(19px*var(--fz));font-weight:700;margin:40px 0 12px}}
h4{{font-size:calc(15.5px*var(--fz));font-weight:700;margin:26px 0 8px;color:var(--text2)}}
h5{{font-size:calc(14.5px*var(--fz));margin:20px 0 6px;color:var(--text2)}}
h6{{font-size:calc(14px*var(--fz));margin:18px 0 6px;color:var(--text3)}}
p{{margin:10px 0}}
ul,ol{{padding-left:22px}}li{{margin:5px 0}}
.code-block{{background:var(--code-bg);color:var(--code-text);border-radius:var(--radius);padding:20px 22px;
  font-family:var(--font-mono);font-size:calc(13px*var(--fz));line-height:1.7;overflow-x:auto;margin:16px 0;position:relative;
  white-space:pre-wrap;word-wrap:break-word;border-left:4px solid var(--accent)}}
.code-block .label{{position:absolute;top:8px;right:12px;font-size:calc(10.5px*var(--fz));color:#9aa3a6;
  background:rgba(255,255,255,.08);padding:2px 8px;border-radius:3px;font-family:var(--font-head);font-weight:700}}
/* 흐름 다이어그램 — 단(stage)별 색. 좁은 화면에서는 세로로 쌓고 화살표를 아래로 돌린다 */
.flow{{margin:22px 0;padding:20px 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-soft);
  container-type:inline-size;container-name:flow}}
.flow-row{{display:flex;align-items:stretch;justify-content:center;gap:0}}
.flow-row+.flow-row{{margin-top:18px;padding-top:18px;border-top:1px dashed var(--border)}}
.fnode{{flex:1 1 0;min-width:0;max-width:260px;border:1.5px solid var(--st-bd);background:var(--st-bg);border-radius:8px;
  padding:10px 8px 9px;text-align:center;display:flex;flex-direction:column;justify-content:center;gap:2px}}
.fnode-badge{{font-family:var(--font-head);font-size:calc(10.5px*var(--fz));font-weight:800;letter-spacing:.4px;color:var(--st-fg);opacity:.85}}
.fnode-title{{font-family:var(--font-head);font-weight:800;font-size:calc(13.5px*var(--fz));color:var(--st-fg);line-height:1.35;margin:2px 0}}
.fnode-sub{{font-size:calc(12px*var(--fz));color:var(--text2);line-height:1.5}}
.fnode code.inline,.farrow code.inline{{font-size:calc(11px*var(--fz));padding:0 3px;overflow-wrap:normal;word-break:keep-all}}
.farrow code.inline{{font-size:calc(10.5px*var(--fz))}}
.fnode-title code.inline{{font-size:calc(12.5px*var(--fz))}}
.farrow{{flex:0 1 128px;min-width:84px;display:flex;flex-direction:column;justify-content:center;align-items:center;
  padding:0 8px;text-align:center;--fa:var(--accent)}}
.farrow.fa-danger{{--fa:var(--danger)}}
.farrow-label{{font-family:var(--font-head);font-weight:700;font-size:calc(11.5px*var(--fz));color:var(--fa);line-height:1.4;margin-bottom:5px}}
.farrow-sub{{font-size:calc(11px*var(--fz));color:var(--text3);line-height:1.4;margin-top:5px}}
.farrow-line{{position:relative;width:100%;height:2px;background:var(--fa)}}
.farrow-line::after{{content:"";position:absolute;right:-1px;top:-5px;border:6px solid transparent;border-left:9px solid var(--fa);border-right:0}}
.flow figcaption{{margin-top:14px;font-size:calc(12.5px*var(--fz));color:var(--text3);text-align:center;line-height:1.6}}
.st-org{{--st-bg:#f6efe4;--st-bd:#d9c3a2;--st-fg:#8a6433}}
.st-mig{{--st-bg:#eef6e8;--st-bd:#86c25a;--st-fg:#3f7a1f}}
.st-dev{{--st-bg:#e8f3f7;--st-bd:#6aa9c2;--st-fg:#2f6f8f}}
.st-prd{{--st-bg:#ebeffb;--st-bd:#7d91d6;--st-fg:#3a4f9e}}
.st-file{{--st-bg:#f2f4f4;--st-bd:#aab2b5;--st-fg:#4f5657}}
@media (prefers-color-scheme:dark){{
  :root:not([data-theme="light"]) .st-org{{--st-bg:rgba(217,195,162,.09);--st-bd:#7f6a4c;--st-fg:#e3c89f}}
  :root:not([data-theme="light"]) .st-mig{{--st-bg:rgba(109,179,63,.12);--st-bd:#4f8a2c;--st-fg:#8fdc55}}
  :root:not([data-theme="light"]) .st-dev{{--st-bg:rgba(106,169,194,.12);--st-bd:#3f7f99;--st-fg:#7cc3e0}}
  :root:not([data-theme="light"]) .st-prd{{--st-bg:rgba(125,145,214,.13);--st-bd:#5364a8;--st-fg:#a9b8f2}}
  :root:not([data-theme="light"]) .st-file{{--st-bg:rgba(255,255,255,.05);--st-bd:#59636a;--st-fg:#c3cacd}}
}}
:root[data-theme="dark"] .st-org{{--st-bg:rgba(217,195,162,.09);--st-bd:#7f6a4c;--st-fg:#e3c89f}}
:root[data-theme="dark"] .st-mig{{--st-bg:rgba(109,179,63,.12);--st-bd:#4f8a2c;--st-fg:#8fdc55}}
:root[data-theme="dark"] .st-dev{{--st-bg:rgba(106,169,194,.12);--st-bd:#3f7f99;--st-fg:#7cc3e0}}
:root[data-theme="dark"] .st-prd{{--st-bg:rgba(125,145,214,.13);--st-bd:#5364a8;--st-fg:#a9b8f2}}
:root[data-theme="dark"] .st-file{{--st-bg:rgba(255,255,255,.05);--st-bd:#59636a;--st-fg:#c3cacd}}

/* 노드가 많은 줄은 다이어그램 폭이 부족하면 세로로 쌓는다(노드 4개 이상 760px · 3개 560px · 그 외 440px) */
@container flow (max-width:760px){{
  .flow-row.n4,.flow-row.n5{{flex-direction:column;align-items:stretch}}
  .n4 .fnode,.n5 .fnode{{max-width:none}}
  .n4 .farrow,.n5 .farrow{{flex:0 0 auto;min-width:0;padding:6px 0;flex-direction:row;gap:10px;justify-content:center}}
  .n4 .farrow-line,.n5 .farrow-line{{width:2px;height:26px;order:0;flex:0 0 2px}}
  .n4 .farrow-line::after,.n5 .farrow-line::after{{right:auto;left:-5px;top:auto;bottom:-2px;border:6px solid transparent;border-top:9px solid var(--fa);border-bottom:0}}
  .n4 .farrow-label,.n5 .farrow-label{{order:1;margin:0;text-align:left}}
  .n4 .farrow-sub,.n5 .farrow-sub{{order:2;margin:0;text-align:left}}
}}
@container flow (max-width:560px){{
  .flow-row.n3{{flex-direction:column;align-items:stretch}}
  .n3 .fnode{{max-width:none}}
  .n3 .farrow{{flex:0 0 auto;min-width:0;padding:6px 0;flex-direction:row;gap:10px;justify-content:center}}
  .n3 .farrow-line{{width:2px;height:26px;order:0;flex:0 0 2px}}
  .n3 .farrow-line::after{{right:auto;left:-5px;top:auto;bottom:-2px;border:6px solid transparent;border-top:9px solid var(--fa);border-bottom:0}}
  .n3 .farrow-label{{order:1;margin:0;text-align:left}}
  .n3 .farrow-sub{{order:2;margin:0;text-align:left}}
}}
@container flow (max-width:440px){{
  .flow-row{{flex-direction:column;align-items:stretch}}
  .fnode{{max-width:none}}
  .farrow{{flex:0 0 auto;min-width:0;padding:6px 0;flex-direction:row;gap:10px;justify-content:center}}
  .farrow-line{{width:2px;height:26px;order:0;flex:0 0 2px}}
  .farrow-line::after{{right:auto;left:-5px;top:auto;bottom:-2px;border:6px solid transparent;border-top:9px solid var(--fa);border-bottom:0}}
  .farrow-label{{order:1;margin:0;text-align:left}}
  .farrow-sub{{order:2;margin:0;text-align:left}}
}}

/* 코드 블록 복사 버튼 — 우상단. 언어 라벨은 버튼 왼쪽으로 비킨다 */
.code-wrap{{position:relative;margin:16px 0}}
.code-wrap .code-block{{margin:0;padding-top:40px}}
.code-wrap .code-block .label{{right:92px}}
.copy-btn{{position:absolute;top:8px;right:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);
  color:#e6e8e8;font-family:var(--font-head);font-weight:700;font-size:calc(11.5px*var(--fz));padding:4px 10px;border-radius:3px;
  cursor:pointer;line-height:1.4}}
.copy-btn:hover{{border-color:var(--accent);color:var(--accent-2)}}
.copy-btn:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
.copy-btn.done{{border-color:var(--accent);background:rgba(255,255,255,.14);color:var(--accent-2)}}
code.inline{{font-family:var(--font-mono);font-size:calc(13px*var(--fz));background:var(--inline-bg);border-radius:3px;
  padding:1px 6px;color:var(--inline-text)}}

/* 표 = 카드. 좁은 화면에서는 가로 스크롤하며 양 끝 그림자로 잘린 열을 표시한다 */
.table-wrap{{overflow-x:auto;margin:20px 0;-webkit-overflow-scrolling:touch;
  background:
    linear-gradient(to right,var(--bg) 30%,transparent),
    linear-gradient(to right,transparent,var(--bg) 70%) 100% 0,
    radial-gradient(farthest-side at 0 50%,rgba(0,0,0,.18),transparent),
    radial-gradient(farthest-side at 100% 50%,rgba(0,0,0,.18),transparent) 100% 0;
  background-repeat:no-repeat;background-size:40px 100%,40px 100%,14px 100%,14px 100%;
  background-attachment:local,local,scroll,scroll}}
.comp-table{{width:100%;border-collapse:collapse;font-size:calc(14px*var(--fz));background:var(--card);
  border:1px solid var(--border);box-shadow:var(--shadow)}}
.comp-table th{{background:var(--th);padding:12px 14px;text-align:left;font-family:var(--font-head);
  font-weight:700;font-size:calc(13px*var(--fz));border-bottom:2px solid var(--accent);white-space:nowrap}}
.comp-table td{{padding:10px 14px;border-bottom:1px solid var(--border);vertical-align:top;word-break:break-word}}
.comp-table tr:last-child td{{border-bottom:none}}
.comp-table tbody tr:hover td{{background:var(--bg-soft)}}

/* 콜아웃: 주의(decision) · 위험(danger-box) · 확인/참고(info-box) */
.decision,.danger-box,.info-box{{border:1px solid var(--border);border-left:4px solid var(--warn);
  background:var(--warn-soft);border-radius:var(--radius);padding:14px 18px;margin:20px 0}}
.danger-box{{border-left-color:var(--danger);background:var(--danger-soft)}}
.info-box{{border-left-color:var(--info);background:var(--info-soft)}}
.decision h4,.danger-box h4,.info-box h4{{margin:0 0 6px;font-size:calc(14px*var(--fz))}}
.decision h4{{color:var(--warn)}}.danger-box h4{{color:var(--danger)}}.info-box h4{{color:var(--info)}}
.doc-footer{{margin-top:56px;padding-top:20px;border-top:1px solid var(--border);color:var(--text2);
  font-size:calc(14px*var(--fz));text-align:center;font-family:var(--font-head);font-weight:700}}

/* ── 태블릿 ── */
@media (max-width:1024px){{
  .section.has-side.active{{display:block}}
  .side{{position:static;max-height:none;border-right:none;padding:0 0 14px;margin:0 0 24px;
    border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;gap:6px}}
  .side-title{{width:100%;margin-bottom:4px}}
  .side-link{{border:1px solid var(--border);border-radius:3px;padding:4px 10px;font-size:calc(12.5px*var(--fz))}}
  .side-link:hover{{border-color:var(--accent)}}
}}
@media (max-width:900px){{
  :root{{--nav-h:56px}}
  .header-inner{{padding:0 18px;gap:12px;flex-wrap:wrap}}
  .nav-links{{order:3;flex:1 1 100%;width:100%;margin-left:0;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;
    border-top:1px solid var(--border)}}
  .nav-links::-webkit-scrollbar{{display:none}}
  .nav-links>:first-child{{margin-left:0}}
  .nav-link{{padding:12px 12px 9px}}
  .header-actions{{margin-left:auto}}
  .hero-inner{{padding:40px 18px;gap:24px}}
  .hero-icon{{font-size:64px}}
  .hero h1{{font-size:calc(30px*var(--fz))}}
  .wrap{{padding:28px 18px 60px}}
  h2{{font-size:calc(22px*var(--fz))}} h3{{font-size:calc(17.5px*var(--fz))}}
}}
/* ── 모바일 ── */
@media (max-width:640px){{
  body{{font-size:calc(14.5px*var(--fz))}}
  .brand small{{display:none}}
  .hero-inner{{flex-direction:column;align-items:flex-start;padding:28px 16px;gap:14px}}
  .hero-icon{{font-size:48px}}
  .hero h1{{font-size:calc(24px*var(--fz))}} .hero .meta{{font-size:calc(13.5px*var(--fz))}}
  .green-bar{{height:8px}}
  .wrap{{padding:22px 16px 48px}}
  h2{{font-size:calc(20px*var(--fz))}} h3{{font-size:calc(16.5px*var(--fz));margin-top:30px}}
  .code-block{{padding:14px;font-size:calc(12px*var(--fz))}}
  .flow{{padding:16px 12px}}
  .comp-table{{font-size:calc(13px*var(--fz))}} .comp-table th{{white-space:normal;padding:10px}} .comp-table td{{padding:9px 10px}}
  /* 열이 많은 표가 한 글자 폭으로 찌그러지지 않도록 열 최소 폭을 두고 가로 스크롤에 맡긴다 */
  .comp-table th,.comp-table td{{min-width:88px}}
  .decision,.danger-box,.info-box{{padding:12px 14px}}
  .nav-link,.hbtn{{min-height:40px}}   /* 터치 타깃 */
  .skin-dot{{width:24px;height:24px}} .skin-dots{{gap:10px}}
  .font-btn{{min-width:40px;min-height:36px}}
}}
@media (max-width:400px){{
  .btn-text{{display:none}}
  .brand{{font-size:calc(17px*var(--fz))}}
}}
@media print{{
  :root,:root[data-theme="dark"]{{--bg:#fff;--bg-soft:#fff;--hero:#fff;--card:#fff;--text:#000;--text2:#333;
    --border:#ccc;--th:#f1f4f4;--hero:#fff;--accent-text:var(--sk-text-l);--inline-bg:var(--sk-ibg-l);--inline-text:var(--sk-itx-l)}}
  .site-header,.side,.copy-btn{{display:none!important}}
  .code-wrap .code-block{{padding-top:20px}}
  .hero-inner{{padding:0 0 12px}} .wrap{{padding:0;max-width:none}}
  .section,.section.has-side.active{{display:block!important;page-break-after:always}}
  .section:last-of-type{{page-break-after:auto}}
  h2,h3{{page-break-after:avoid}}
  .table-wrap{{overflow:visible;background:none}}
  .comp-table,.decision,.danger-box,.info-box,.code-block,.flow{{break-inside:avoid;page-break-inside:avoid}}
  *{{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
}}
</style>
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="{index_href}"><span class="brand-mark">📚</span>studio-boos <small>Guides</small></a>
    <nav class="nav-links" aria-label="문서 탭">
      {''.join(nav_buttons)}
    </nav>
    <div class="header-actions">
      <a class="hbtn" href="{index_href}">📚 <span class="btn-text">목차</span></a>
      <button class="hbtn" onclick="window.print()">🖨 <span class="btn-text">PDF</span></button>
      <button class="hbtn" id="prefsBtn" type="button" aria-haspopup="dialog" aria-expanded="false"
        aria-controls="prefsPanel" title="보기 설정" onclick="togglePrefs()">⚙️ <span class="btn-text">설정</span></button>
      <div class="prefs-panel" id="prefsPanel" role="dialog" aria-label="보기 설정" hidden>
        <div class="prefs-title">⚙️ 보기 설정</div>
        <div class="pref-row">
          <span class="pref-label">화면 모드</span>
          <span class="pref-ctrl"><span class="pref-note" id="themeName">주간</span>
            <button class="theme-switch" id="themeSwitch" role="switch" aria-checked="false"
              aria-label="야간 모드" title="주간/야간 전환" onclick="toggleTheme()"><span class="knob">☀</span></button></span>
        </div>
        <div class="pref-row">
          <span class="pref-label">컬러 스킨</span>
          <span class="pref-ctrl skin-dots" role="radiogroup" aria-label="컬러 스킨">{skin_dots}</span>
        </div>
        <span class="skin-name" id="skinName"></span>
        <div class="pref-row">
          <span class="pref-label">글자 크기</span>
          <span class="pref-ctrl" role="group" aria-label="글자 크기">
            <button class="font-btn" id="fontDown" type="button" onclick="stepFont(-1)" aria-label="글자 작게" title="글자 작게">가−</button>
            <span class="font-val" id="fontVal" aria-live="polite">{FONT_BASE}</span>
            <button class="font-btn" id="fontUp" type="button" onclick="stepFont(1)" aria-label="글자 크게" title="글자 크게">가+</button>
          </span>
        </div>
        <button class="prefs-reset" type="button" onclick="resetPrefs()">↺ 기본값으로</button>
      </div>
    </div>
  </div>
</header>

<section class="hero">
  <div class="hero-inner">
    <div class="hero-icon" aria-hidden="true">{esc(hero_icon)}</div>
    <div>
      <h1>{esc(hero_title)}</h1>
      {f'<p class="meta">{esc(meta_line)}</p>' if meta_line else ''}
    </div>
  </div>
</section>
<div class="green-bar"></div>

<main class="wrap">
{''.join(sections)}
{footer_block}
</main>

<script>
function show(ev, name){{
  var btn = ev.currentTarget;
  document.querySelectorAll('.section').forEach(function(s){{s.classList.remove('active');}});
  document.querySelectorAll('.nav-link').forEach(function(l){{l.classList.remove('active');}});
  document.getElementById('sec-'+name).classList.add('active');
  btn.classList.add('active');
  window.scrollTo(0,0);
  // 좁은 화면의 탭 줄은 가로 스크롤이라 선택한 탭이 화면 밖일 수 있다. 세로 위치는 건드리지 않는다.
  if (btn.scrollIntoView) btn.scrollIntoView({{block:'nearest', inline:'center'}});
}}
/* 코드 복사: Clipboard API(https·file) → 실패 시 textarea + execCommand 폴백 */
function copyCode(btn){{
  var pre = btn.parentNode.querySelector('pre');
  var clone = pre.cloneNode(true);
  var lab = clone.querySelector('.label'); if (lab) lab.remove();
  var text = clone.textContent.replace(/\\n$/, '');
  function done(ok){{
    var s = btn.querySelector('span');
    btn.classList.toggle('done', ok);
    s.textContent = ok ? '복사됨' : '복사 실패';
    setTimeout(function(){{ btn.classList.remove('done'); s.textContent = '복사'; }}, 1500);
  }}
  function fallback(){{
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false; try {{ ok = document.execCommand('copy'); }} catch(e) {{}}
    document.body.removeChild(ta); done(ok);
  }}
  if (navigator.clipboard && window.isSecureContext) {{
    navigator.clipboard.writeText(text).then(function(){{ done(true); }}, fallback);
  }} else {{ fallback(); }}
}}
function isDark(){{
  var t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}}
function syncSwitch(){{
  var sw = document.getElementById('themeSwitch'); if (!sw) return;
  var d = isDark();
  sw.setAttribute('aria-checked', d ? 'true' : 'false');
  sw.querySelector('.knob').textContent = d ? '☾' : '☀';
  var n = document.getElementById('themeName'); if (n) n.textContent = d ? '야간' : '주간';
}}
function toggleTheme(){{
  var next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {{ localStorage.setItem('boos-guide-theme', next); }} catch(e) {{}}
  syncSwitch();
}}
/* 컬러 스킨: 기본(Spring.io 그린)은 data-skin 을 지운다 */
function setSkin(k){{
  var r = document.documentElement;
  if (k === 'green') r.removeAttribute('data-skin'); else r.setAttribute('data-skin', k);
  try {{ localStorage.setItem('boos-guide-skin', k); }} catch(e) {{}}
  syncSkin();
}}
function syncSkin(){{
  var cur = document.documentElement.getAttribute('data-skin') || 'green';
  document.querySelectorAll('.skin-dot').forEach(function(d){{
    var on = d.getAttribute('data-skin') === cur;
    d.setAttribute('aria-checked', on ? 'true' : 'false');
    if (on) document.getElementById('skinName').textContent = d.getAttribute('aria-label');
  }});
}}
/* 글자 크기: 본문 기준 px({FONT_MIN}~{FONT_MAX})을 --fz 배율로 적용한다. 헤더 글자는 고정이다 */
function curFont(){{
  var z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fz')) || 1;
  return Math.round(z * {FONT_BASE});
}}
function syncFont(){{
  var f = curFont();
  document.getElementById('fontVal').textContent = f;
  document.getElementById('fontDown').disabled = f <= {FONT_MIN};
  document.getElementById('fontUp').disabled = f >= {FONT_MAX};
}}
function stepFont(d){{
  var f = Math.min({FONT_MAX}, Math.max({FONT_MIN}, curFont() + d));
  document.documentElement.style.setProperty('--fz', f / {FONT_BASE});
  try {{ localStorage.setItem('boos-guide-font', f); }} catch(e) {{}}
  syncFont();
}}
/* 보기 설정 레이어: ⚙ 버튼으로 열고, 바깥 클릭·Esc 로 닫는다 */
function togglePrefs(open){{
  var btn = document.getElementById('prefsBtn'), panel = document.getElementById('prefsPanel');
  if (open === undefined) open = panel.hidden;
  panel.hidden = !open;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}}
function resetPrefs(){{
  var r = document.documentElement;
  r.removeAttribute('data-theme'); r.removeAttribute('data-skin'); r.style.removeProperty('--fz');
  try {{ ['boos-guide-theme','boos-guide-skin','boos-guide-font'].forEach(function(k){{ localStorage.removeItem(k); }}); }} catch(e) {{}}
  syncSwitch(); syncSkin(); syncFont();
}}
document.addEventListener('click', function(e){{
  var panel = document.getElementById('prefsPanel');
  if (!panel.hidden && !panel.contains(e.target) && !document.getElementById('prefsBtn').contains(e.target)) togglePrefs(false);
}});
document.addEventListener('keydown', function(e){{
  if (e.key === 'Escape' && !document.getElementById('prefsPanel').hidden) {{
    togglePrefs(false); document.getElementById('prefsBtn').focus();
  }}
}});
if (window.matchMedia) {{
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq.addEventListener) mq.addEventListener('change', syncSwitch);
}}
syncSwitch(); syncSkin(); syncFont();
</script>
</body>
</html>
"""


def convert_file(md_path: Path) -> Path:
    md_text = md_path.read_text(encoding="utf-8")
    title, meta, tabs, footer_html = convert(md_text, md_path.stem)
    out_path = md_path.with_suffix(".html")
    # 목차 문서는 디렉터리 이름을 따른다(docs/guide/guide.md). docs/ 아래 어느 깊이의
    # 문서에서도 guide.html 로의 상대 경로를 정확히 계산한다(os.path.relpath).
    if (GUIDE_DIR / "guide.md").exists():
        index_href = os.path.relpath(GUIDE_DIR / "guide.html", md_path.resolve().parent)
    else:
        index_href = out_path.name
    out_path.write_text(render_page(title, meta, tabs, footer_html, index_href), encoding="utf-8")
    return out_path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", help="변환할 .md 파일 경로")
    parser.add_argument("--all", action="store_true",
                        help="docs/ 아래 모든 문서 .md 전체 변환")
    args = parser.parse_args()

    targets = []
    if args.all:
        targets = discover_all_md()
    else:
        targets = [Path(p) for p in args.paths]

    if not targets:
        parser.error("변환할 파일을 지정하거나 --all을 사용하세요.")

    for md_path in targets:
        out_path = convert_file(md_path)
        print(f"{md_path} -> {out_path}")


if __name__ == "__main__":
    sys.exit(main())
