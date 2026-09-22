const $ = id => document.getElementById(id);
const PLAN = {
  Monday:{title:"Upper A",type:"Strength",exercises:[
    ["Push-up","3 sets × 5–12","Chest • triceps • shoulders","Use an easier version if needed. Stop with ~1–3 clean reps left."],
    ["Backpack row","3 sets × 8–15","Back • biceps","Brace your body and pull the backpack toward your lower ribs."],
    ["Pike push-up","3 sets × 5–12","Shoulders • triceps","Keep hips high and lower your head toward the floor."],
    ["Backpack curl","2 sets × 10–15","Biceps","Control the lowering phase."],
    ["Backpack overhead triceps extension","2 sets × 10–15","Triceps","Keep elbows pointing mostly forward."],
    ["Reverse snow angels","2 sets × 12–20","Upper back • rear shoulders","Move slowly; don't shrug."]
  ]},
  Tuesday:{title:"Lower A + Core",type:"Strength",exercises:[
    ["Bulgarian split squat","3 sets × 8–12 / leg","Quads • glutes","Use a chair/bed behind you for the rear foot."],
    ["Tempo squat","3 sets × 10–15","Legs","3 seconds down, brief pause, stand."],
    ["Backpack Romanian deadlift","3 sets × 10–15","Hamstrings • glutes • back","Push hips backward; keep the back neutral."],
    ["Glute bridge","3 sets × 12–20","Glutes","Squeeze at the top."],
    ["Calf raise","3 sets × 15–25","Calves","Use a wall for balance."],
    ["Reverse crunch","3 sets × 10–15","Abs","Curl the pelvis upward; don't swing."],
    ["Plank","2 sets × 30–60 sec","Core","Brace your stomach and breathe."]
  ]},
  Wednesday:{title:"Walking / Cardio",type:"Recovery",exercises:[
    ["Brisk walk","30–45 minutes","Cardio • general fitness","Comfortably challenging. You should still be able to speak."]
  ]},
  Thursday:{title:"Upper B",type:"Strength",exercises:[
    ["Decline push-up","3 sets × 5–12","Chest • shoulders • triceps","If too difficult, use normal push-ups."],
    ["Backpack row","3 sets × 8–15","Back • biceps","Control both directions."],
    ["Pike push-up","3 sets × 5–12","Shoulders • triceps","Don't rush reps."],
    ["Water-bottle lateral raise","2 sets × 12–20","Side shoulders","Light weight; don't swing."],
    ["Backpack curl","2 sets × 10–15","Biceps","Full controlled range."],
    ["Backpack overhead triceps extension","2 sets × 10–15","Triceps","Keep the movement controlled."],
    ["Reverse snow angels","2 sets × 12–20","Upper back • rear shoulders","Slow and controlled."]
  ]},
  Friday:{title:"Lower B + Core",type:"Strength",exercises:[
    ["Bulgarian split squat","3 sets × 8–15","Quads • glutes","Add reps before adding backpack weight."],
    ["Tempo squat","3 sets × 10–20","Legs","Slow on the way down."],
    ["Backpack Romanian deadlift","3 sets × 10–15","Hamstrings • glutes","Hinge at the hips."],
    ["Single-leg glute bridge","3 sets × 8–15 / leg","Glutes","Keep hips level."],
    ["Calf raise","3 sets × 15–25","Calves","Pause at the top."],
    ["Reverse crunch","3 sets × 10–20","Abs","No swinging."],
    ["Plank","2 sets × 30–60 sec","Core","Stop if your lower back takes over."]
  ]},
  Saturday:{title:"Walking / Cardio",type:"Recovery",exercises:[
    ["Walk / easy cardio","30–60 minutes","Cardio • general fitness","Walking is enough. Later you can progress to walk/run intervals."]
  ]},
  Sunday:{title:"Rest",type:"Rest",exercises:[]}
};

const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const KEY="homeStrengthTracker_v1";
let data=JSON.parse(localStorage.getItem(KEY)||'{"logs":{},"checkins":[],"photos":[]}');

function save(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function iso(d=new Date()){return d.toISOString().slice(0,10)}
function dayName(d=new Date()){return DAYS[d.getDay()]}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function setsFor(ex){return ex[1].match(/^(\d+)/)?.[1]*1||1}
function logKey(date,ex){return `${date}__${ex}`}
function getLog(date,ex){return data.logs[logKey(date,ex)]||{sets:[],completed:false}}

function renderToday(){
  const date=iso(), day=dayName(), p=PLAN[day];
  $("todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});
  $("todayTitle").textContent=p.title;
  $("todaySubtitle").textContent=p.type==="Rest"?"Recovery day — no workout required.":p.type==="Recovery"?"Keep it easy today":`${p.exercises.length} exercises • 45–60 min`;
  $("dayBadge").textContent=day;
  if(!p.exercises.length){
    $("todayContent").innerHTML=`<div class="card"><h3>Rest day</h3><p>Recover, eat, hydrate and sleep. A rest day is part of the program.</p></div>`;
    return;
  }
  $("todayContent").innerHTML="";
  p.exercises.forEach(ex=>{
    const t=document.importNode($("exerciseTemplate").content,true);
    t.querySelector(".exerciseName").textContent=ex[0];
    t.querySelector(".exerciseNote").textContent=`${ex[2]} • ${ex[3]}`;
    t.querySelector(".target").textContent=ex[1];
    const sets=t.querySelector(".sets"), n=setsFor(ex), l=getLog(date,ex[0]);
    for(let s=0;s<n;s++){
      const val=l.sets[s]??"";
      const box=document.createElement("div");
      box.className="set"+(val!==""?" done":"");
      box.innerHTML=`<label>SET ${s+1}</label><input type="number" min="0" inputmode="numeric" value="${escapeHtml(val)}" placeholder="reps"><button>${val!==""?"✓ Logged":"Log set"}</button>`;
      const input=box.querySelector("input"), btn=box.querySelector("button");
      btn.onclick=()=>{
        const x=getLog(date,ex[0]);
        x.sets[s]=input.value;
        data.logs[logKey(date,ex[0])]=x;
        save();
      };
      sets.appendChild(box);
    }
    const article=t.querySelector(".exercise");
    const doneBtn=document.createElement("button");
    doneBtn.className="secondary";
    doneBtn.textContent=l.completed?"✓ Exercise complete":"Mark exercise complete";
    doneBtn.style.marginTop="10px";
    doneBtn.onclick=()=>{
      const x=getLog(date,ex[0]);
      x.completed=!x.completed;
      data.logs[logKey(date,ex[0])]=x;
      save();
    };
    article.appendChild(doneBtn);
    $("todayContent").appendChild(t);
  });
  const complete=document.createElement("button");
  complete.className="primary";
  complete.textContent="✓ Complete today's workout";
  complete.onclick=()=>{
    data.logs[`DAY__${date}`]={completed:true};
    save();
    alert("Workout marked complete.");
  };
  $("todayContent").appendChild(complete);
}

function renderPlan(){
  $("planContent").innerHTML="";
  ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].forEach(day=>{
    const p=PLAN[day], div=document.createElement("div");
    div.className="dayCard";
    div.innerHTML=`<div class="dayTitle"><h3>${day} — ${p.title}</h3><span class="badge">${p.type}</span></div>`;
    if(!p.exercises.length) div.innerHTML+=`<p>Full rest. Recovery matters.</p>`;
    p.exercises.forEach(e=>{
      div.innerHTML+=`<div class="exerciseLine"><span><b>${escapeHtml(e[0])}</b><br><span class="muted">${escapeHtml(e[2])}</span></span><span class="muted">${escapeHtml(e[1])}</span></div>`;
    });
    $("planContent").appendChild(div);
  });
}

function renderStats(){
  const days=new Set(), workouts=new Set();
  const setCount=Object.values(data.logs).reduce((a,l)=>{
    if(l.sets) a+=l.sets.filter(x=>x!==""&&x!=null).length;
    return a;
  },0);
  Object.keys(data.logs).forEach(k=>{
    if(k.startsWith("DAY__")){
      const d=k.slice(5);
      if(data.logs[k].completed){days.add(d);workouts.add(d)}
    }
  });
  $("workoutsDone").textContent=workouts.size;
  $("daysDone").textContent=days.size;
  $("totalSets").textContent=setCount;
  let streak=0,d=new Date();
  while(true){
    const k=`DAY__${iso(d)}`;
    if(data.logs[k]?.completed){streak++;d.setDate(d.getDate()-1)}else break;
  }
  $("currentStreak").textContent=streak;
}

function renderHistory(){
  $("history").innerHTML=data.checkins.slice().reverse().map(c=>
    `<div class="checkin"><b>${escapeHtml(c.date)}</b><div class="muted">Weight ${escapeHtml(c.weight)||"—"} kg • Waist ${escapeHtml(c.waist)||"—"} cm • Chest ${escapeHtml(c.chest)||"—"} cm • Arm ${escapeHtml(c.arm)||"—"} cm • Push-ups ${escapeHtml(c.pushups)||"—"} • Plank ${escapeHtml(c.plank)||"—"} sec</div></div>`
  ).join("")||`<div class="card"><p>No check-ins yet. Do your baseline before starting.</p></div>`;
}

function renderPhotos(){
  $("photoList").innerHTML=data.photos.slice().reverse().map((p,i)=>
    `<div class="photo"><span><b>${escapeHtml(p.date)}</b><br><span class="muted">${escapeHtml(p.filename)}</span></span><button class="secondary" onclick="deletePhoto(${data.photos.length-1-i})">Delete</button></div>`
  ).join("")||`<div class="card"><p>No photo records yet.</p></div>`;
}

function renderAll(){renderToday();renderPlan();renderStats();renderHistory();renderPhotos()}

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  document.getElementById(b.dataset.tab).classList.add("active");
});

$("saveBaseline").onclick=()=>{
  data.checkins.push({
    date:iso(),
    weight:$("weightInput").value,
    waist:$("waistInput").value,
    chest:$("chestInput").value,
    arm:$("armInput").value,
    pushups:$("pushupInput").value,
    plank:$("plankInput").value
  });
  ["weightInput","waistInput","chestInput","armInput","pushupInput","plankInput"].forEach(id=>$(id).value="");
  save();
};

$("savePhoto").onclick=()=>{
  if(!$("photoFilename").value)return alert("Enter the photo filename.");
  data.photos.push({date:$("photoDate").value||iso(),filename:$("photoFilename").value});
  $("photoFilename").value="";
  save();
};

function deletePhoto(i){data.photos.splice(i,1);save()}

$("resetBtn").onclick=()=>{
  if(confirm("Delete ALL tracker data from this browser?")){
    localStorage.removeItem(KEY);
    data={logs:{},checkins:[],photos:[]};
    renderAll();
  }
};

function downloadFile(name,text,type="application/json"){
  const blob=new Blob([text],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=name;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function initBackupButtons(){
  const exportBtn=$("exportData"), importBtn=$("importData"), fileInput=$("importFile");
  if(exportBtn) exportBtn.onclick=()=>{
    downloadFile(`fit-tracker-backup-${iso()}.json`,JSON.stringify(data,null,2));
  };
  if(importBtn) importBtn.onclick=()=>fileInput.click();
  if(fileInput) fileInput.onchange=async()=>{
    const file=fileInput.files?.[0];
    if(!file)return;
    try{
      const imported=JSON.parse(await file.text());
      if(!imported || typeof imported!=="object" || !imported.logs || !Array.isArray(imported.checkins) || !Array.isArray(imported.photos))
        throw new Error("Invalid Fit Tracker backup");
      data=imported;
      save();
      alert("Backup restored.");
    }catch(e){
      alert("Could not import that JSON backup.");
    }
    fileInput.value="";
  };
}

renderAll();
initBackupButtons();
