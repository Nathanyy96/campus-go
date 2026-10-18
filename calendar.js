// One elapsed-day counter, Gregorian dates starting Saturday 2000-01-01.
// Integer calendar arithmetic avoids JavaScript Date's year/range limitations.
export function calendarDate(day){
 const n=BigInt(Math.max(1,Math.trunc(Number(day)||1)));
 const z=n-1n+10957n+719468n,era=z/146097n,doe=z-era*146097n;
 const yoe=(doe-doe/1460n+doe/36524n-doe/146096n)/365n;
 let year=yoe+era*400n;const doy=doe-(365n*yoe+yoe/4n-yoe/100n),mp=(5n*doy+2n)/153n;
 const date=doy-(153n*mp+2n)/5n+1n,month=mp+(mp<10n?3n:-9n);if(month<=2n)year++;
 return {year:String(year),month:Number(month),date:Number(date)};
}
export function gameDate(day){const c=calendarDate(day);return `${c.year}年${c.month}月${c.date}日`;}
export const weekday=day=>((Number(day)+4)%7+7)%7; // Monday=0, Sunday=6.
export const datedText=value=>String(value??'').replace(/第\s*(\d+)\s*天/g,(_,day)=>gameDate(day));
