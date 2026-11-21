// 포털에서 직접 가꾸는 정원의 자체 벡터 그림. 콘텐츠 카드는 ui/artwork.js를 쓴다.
export function illustration(engine,variant=0){
 if(engine!=='garden')throw new Error('정원 전용 그림입니다');
 const colors=['#ee987b','#eebf5f','#9cb6e5','#94bca1'];
 const flower=(x,y,c)=>`<g transform="translate(${x} ${y})"><path d="M0 0V65M0 40Q-32 14-30 38Q-10 56 0 48M0 30Q28 9 30 30Q12 46 0 40" fill="#5d997c" stroke="#5d997c" stroke-width="5"/><g fill="${c}"><ellipse rx="17" ry="32"/><ellipse rx="17" ry="32" transform="rotate(60)"/><ellipse rx="17" ry="32" transform="rotate(120)"/></g><circle r="12" fill="#fff2ba"/></g>`;
 return `<svg viewBox="0 0 340 220" aria-hidden="true">${flower(100,102,colors[variant%4])}${flower(174,82,colors[(variant+1)%4])}${flower(244,116,colors[(variant+2)%4])}</svg>`;
}
