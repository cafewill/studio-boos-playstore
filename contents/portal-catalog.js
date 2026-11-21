// 요약과 필터는 동일한 집계를 사용한다. 화면·검색 결과와 별개인 전체 목록 기준이다.
export function catalogSummary(contents){
 const groups=new Map();
 for(const content of contents)groups.set(content.category,(groups.get(content.category)??0)+1);
 return{total:contents.length,categories:[...groups].map(([name,count])=>({name,count}))};
}
