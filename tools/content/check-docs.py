#!/usr/bin/env python3
"""문서 HTML을 수정하지 않고 재생성 결과·내부 링크를 확인한다."""
import importlib.util
import os
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('md_to_html',ROOT/'docs/tools/md_to_html.py')
converter=importlib.util.module_from_spec(spec);spec.loader.exec_module(converter)
errors=[]
for md in converter.discover_all_md():
 title,meta,tabs,footer=converter.convert(md.read_text(),md.stem)
 index=os.path.relpath(ROOT/'docs/guide/guide.html',md.parent)
 expected=converter.render_page(title,meta,tabs,footer,index)
 html=md.with_suffix('.html')
 if not html.exists() or html.read_text()!=expected:errors.append(f'HTML 현행화 필요: {md.relative_to(ROOT)}')
files=[*ROOT.glob('*.md'),*ROOT.glob('docs/**/*.md'),*ROOT.glob('docs/**/*.html'),*ROOT.glob('contents/**/*.md'),*ROOT.glob('contents/**/*.html'),*ROOT.glob('tools/*.md'),ROOT/'tools/store/README.md',*ROOT.glob('test/*.md')]
for p in files:
 text=p.read_text();links=re.findall(r'\[[^\]]+\]\(([^)]+)\)',text) if p.suffix=='.md' else re.findall(r'(?:href|src)="([^"]+)"',text)
 for link in links:
  if link.startswith(('http:','https:','#','mailto:','data:','javascript:')):continue
  if not (p.parent/link.split('#')[0].split('?')[0]).exists():errors.append(f'깨진 링크: {p.relative_to(ROOT)} -> {link}')
if errors:raise SystemExit('\n'.join(errors))
print(f'문서·진입 링크 통과: MD/HTML {len(converter.discover_all_md())}쌍, 읽기 전용 검사')
