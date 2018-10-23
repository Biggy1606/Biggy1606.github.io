var now = new Date();
var days = new Array('Niedziela','Poniedziałek','Wtorek','roda','Czwartek','Piątek','Sobota');
var months = new Array('Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Pażdziernik','Listopad','Grudzień');
var date = ((now.getDate()<10) ? "0" : "")+ now.getDate();
var today = String;

function fourDigitYear(number)	{
	return (number < 1000) ? number + 1900 : number;
}
today = days[now.getDay()] + ", " +
        months[now.getMonth()] + " " +
        date + ", " +
        (fourDigitYear(now.getYear())) ;
document.write(today);