//cal 전역변수 생성, 달력에서 사용
var cal={  
  mName : ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  data : null, // 이벤트 데이터
  sDay : 0, // 선택 날짜
  sMth : 0, // 선택 월
  sYear : 0, // 선택 년도
  sMon : false, // 일요일 시작을 위한 불리안변수
} 

  // 선택한 월에 달력출력함수
  function list() {
    cal.sMth = parseInt(document.getElementById("cal-mth").value); // 선택 월 연결
    cal.sYear = parseInt(document.getElementById("cal-yr").value); // 선택 년도 연결
    var daysInMth = new Date(cal.sYear, cal.sMth+1, 0).getDate(), // 선택한 월의 총 일수 
        startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // 1일의 데이터
        endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(); // 월의 마지막날의 데이터

    // 로컬스토리지에 저장된 일정 로드
    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.data==null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }

    // 달력그리기
    // 1일 이전의 날짜에서 Blank 입력
    var squares = [];
    if (cal.sMon && startDay != 1) {
      var blanks = startDay==0 ? 7 : startDay ;
      for (var i=1; i<blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (var i=0; i<startDay; i++) { squares.push("b"); }
    }

    //날짜 입력
    for (var i=1; i<=daysInMth; i++) { squares.push(i); }

    // 마지막날 이후의 날짜에서 Blacnk 입력
    if (cal.sMon && endDay != 0) {
      var blanks = endDay==6 ? 1 : 7-endDay;
      for (var i=0; i<blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && endDay != 6) {
      var blanks = endDay==0 ? 6 : 6-endDay;
      for (var i=0; i<blanks; i++) { squares.push("b"); }
    }

    // HTML에 달력출력    
    var container = document.getElementById("cal-container"),
        cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    //달력의 첫번째 행에 요일 출력
    var cRow = document.createElement("tr"),
        cCell = null,
        days = ["일", "월", "화", "수", "목", "금", "토"];
    if (cal.sMon) { days.push(days.shift()); }
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("head");
    cTable.appendChild(cRow);

    //총 일수 계산
    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("day");
    for (var i=0; i<total; i++) {
      cCell = document.createElement("td");
      if (squares[i]=="b") { cCell.classList.add("blank"); }
      else {
        cCell.innerHTML = "<span class='dd'>"+squares[i]+"</span>";
        if (cal.data[squares[i]]) {
          cCell.innerHTML += "<span class='evt'>" + cal.data[squares[i]] + "</span>";
        }
        cCell.addEventListener("click", function(){
          show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i!=0 && (i+1)%7==0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("day");
      }
    }
    close();
  }

  //선택날짜 일정 함수
  function show(el) {
    cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;

    //일정함수 폼 구현
    var tForm = "<h1>" + "일정" + " " + (cal.data[cal.sDay] ? "편집" : "추가") + " (일정의 구분은 엔터키 사용!) " + "</h1>";
    tForm += "<span id='evt-date'>" + cal.sYear + "년 " + cal.mName[cal.sMth] + " " + cal.sDay + "일 " + "</span><br>";
    tForm += "<textarea id='evt-details' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "") + "</textarea>";
    tForm += "<input type='button' value='취소' onclick='close()'/>";
    tForm += "<input type='button' value='삭제' onclick='del()'/>";
    tForm += "<input type='submit' value='저장' onClick='save()'/>";

    // 일정함수 HTML에 추가
    var eForm = document.createElement("form");
    var inputText = document.getElementById("evt-details");
    //eForm.addEventListener("submit", save(cal));
    eForm.innerHTML = tForm;
    var container = document.getElementById("cal-event");
    container.innerHTML = "";
    container.appendChild(eForm);
  }

  // 일정함수 닫기
  function close() {
    document.getElementById("cal-event").innerHTML = "";
  }

  // 일정함수 저장
  function save(evt) {
    //evt.stopPropagation();
    //evt.preventDefault();
    cal.data[cal.sDay] = document.getElementById("evt-details").value;
    localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
    list();
  }

  // 일정 삭제함수
  function del() {
    if (confirm("일정을 지우시겠습니까?")) {
      delete cal.data[cal.sDay];
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
      list();
    }
  }


// 윈도우 로드이벤트,날짜 초기화,달력출력
window.addEventListener("load", function () {
  //now = 현재날짜
  var now = new Date(),
      nowDay = now.getDate(),
      nowMth = now.getMonth(),
      nowYear = parseInt(now.getFullYear());

  // 월 선택버튼 추가
  var month = document.getElementById("cal-mth");
  for (var i = 0; i < 12; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = cal.mName[i];
    if (i==nowMth) { opt.selected = true; }
    month.appendChild(opt);
  }

  // 년도 선택버튼 추가
  // 최대 년도는 +20년 
  var year = document.getElementById("cal-yr");
  for (var i = nowYear; i<=nowYear+20; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i+"년";
    if (i==nowYear) { opt.selected = true; }
    year.appendChild(opt);
  }

  // 날짜선택,이동버튼 클릭시 해당 달력출력
  document.getElementById("cal-set").addEventListener("click", function(){
    list();
  });

  //오늘은? 버튼 클릭시 오늘달력 출력
  document.getElementById("cal-today").addEventListener("click", function(){
    document.getElementById("cal-mth").value = nowMth;
    document.getElementById("cal-yr").value = nowYear;
    alert("오늘은 "+nowYear+"년 "+(nowMth+1) + "월 " + nowDay + "일 입니다.!" );
    list();
  });

  //최초로드시 달려출력
  list();
});


//시계영역
function printClock() {
  var clock = document.getElementById("clock");            
  var currentDate = new Date();                          
  var amPm = 'AM'; // 초기값 AM
  var currentHours = addZeros(currentDate.getHours(),2); 
  var currentMinute = addZeros(currentDate.getMinutes() ,2);
  var currentSeconds =  addZeros(currentDate.getSeconds(),2);
  
  if(currentHours >= 12){
    amPm = 'PM';
    currentHours = addZeros(currentHours - 12,2);
  }
  clock.innerHTML = currentHours+":"+currentMinute+":"+currentSeconds +" <span style='font-size:50px;'>"+ amPm+"</span>"; //날짜를 출력해 줌
  setTimeout("printClock()",1000);         // 1초마다 printClock() 함수 호출
}

//시계 자리수 설정
function addZeros(num, digit) {
  var zero = '';
  num = num.toString();
  if (num.length < digit) {
    for (i = 0; i < digit - num.length; i++) {
      zero += '0';
    }
  }  
  return zero + num;
}

//오늘일정 로드함수
function loadTodaySchedule(){
  var now = new Date();
  var nowDay = now.getDate();
  var scTable = document.getElementById("schedule-table");
  scTable.innerHTML="";
  var event = JSON.parse(localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear));
  
  //오늘일정이 없을경우!
  if(JSON.stringify(event)=="{}" || event[nowDay] ==null){
    var addRow = scTable.insertRow(scTable.rows.length);
    var cell1 = addRow.insertCell(0);
    var cell2 = addRow.insertCell(1);
    cell1.innerHTML = "●";
    cell2.innerHTML = "오늘 일정은 없습니다!";
  }

  //일정이 존재할 경우
  else{
    var text = event[nowDay];
    var splitText = text.split('\n');
    for(var i in splitText){    
      var addRow = scTable.insertRow(scTable.rows.length);
      var cell1 = addRow.insertCell(0);
      var cell2 = addRow.insertCell(1);
      cell1.innerHTML = "●";
      cell2.innerHTML = splitText[i];
    }
  }
}

function addAlClock(){
  var AMPM = document.getElementById("AMPM");
  var hour = document.getElementById("al-hour");
  var min = document.getElementById("al-min");
  var listAMPM = ["오전","오후"];
  
  //오전 오후 추가
  while(AMPM.firstChild){
    AMPM.removeChild(AMPM.firstChild);
  }
  for(i in listAMPM){
    var option = document.createElement("option");
    option.value = listAMPM[i];
    option.innerHTML = listAMPM[i];
    AMPM.appendChild(option);
  }

  //시간 추가, 1~9시에는 앞에 0추가
  while(hour.firstChild){
    hour.removeChild(hour.firstChild);
  }
  for(i=0; i<13 ;i++){
    hour.options[hour.options.length] = new Option(i <10 ? "0" + i : i,i);
}

  //분 추가
  while(min.firstChild){
    min.removeChild(min.firstChild);
  }
  //00~10분에는 앞에 0을 추가하여 입력
  for(i=0; i<60 ;i++){
    min.options[min.options.length] = new Option(i <10 ? "0" + i : i,i);
  }
}

//알람추가 함수
function addAL(){
  var AMPM = document.getElementById("AMPM");
  var hour = document.getElementById("al-hour");
  var min = document.getElementById("al-min");
  var memo = document.getElementById("al-memo");
  var alTable = document.getElementById("al-table");
  var delBtn = document.createElement("button");  
  delBtn.innerText = "삭제";  
  
  //삭제버튼 클릭시 그 행 삭제
  delBtn.onclick = function(){
    var delRow = this.parentNode.parentNode;
    delRow.parentNode.removeChild(delRow);
  }

  //행 추가
  var addAlRow = alTable.insertRow(alTable.rows.length);
  var alCell1 = addAlRow.insertCell(0);
  var alCell2 = addAlRow.insertCell(1);
  var alCell3 = addAlRow.insertCell(2);

  alCell1.innerHTML = AMPM.value + " " + hour.options[hour.selectedIndex].text + "시 " + min.options[min.selectedIndex].text + "분 ";
  alCell2.innerHTML = memo.value;
  alCell3.appendChild(delBtn);
  memo.value ="";
}


//알람체크함수
function checkAL(){
  //현재시간 am, 시 분을 체크하여 설정된 알람이랑 비교, 음악재생
  var currentDate = new Date(); 
  var amPm = '오전'; // 초기값 AM
  var currentHours = addZeros(currentDate.getHours(),2); 
  var currentMinute = addZeros(currentDate.getMinutes() ,2);
  var currentSeconds =  addZeros(currentDate.getSeconds(),2);
  var message = document.getElementById("al-memo-post"); // 알람메시지

  if(currentHours >= 12){
    amPm = '오후';
    currentHours = addZeros(currentHours - 12,2);
  }
  //현재시간
  var now = amPm +" "+ currentHours + "시 " + currentMinute + "분" + currentSeconds;
    
  //설정된 알람 불러오기
  var alTable = document.getElementById("al-table");
  var array = [];
  var arrayMemo = [];

  //테이블의 0열(시간),1열(메모)를 불러오기
  for(i = 2; i< alTable.rows.length; i++){
    array[i-2] = alTable.rows[i].cells[0].innerText +"00";
    arrayMemo[i-2] = alTable.rows[i].cells[1].innerText;
  }   

  for(i =0; i<array.length;i++){       
    if(array[i] == now){
      //알람 스타트!      
      //음악재생
      var audio = new Audio('alarm.mp3');
      audio.play();      
      console.log("알람울림!");
      message.innerText = "일정 : "+ arrayMemo[i] + " 할 시간입니다.";
      break;
    }
    else{
      console.log("알람시간아님");
    }    
  }  
  setTimeout("checkAL()",1000);   //1초마다 알람함수 실행
}




