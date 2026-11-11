const QUESTIONS = [
 {id:1,q:"Dans l'approche conventionnelle, comment l'organisation est-elle vue ?",a:["Comme un processus entièrement créé par la communication","Comme un contenant dans lequel circule la communication","Comme un simple ensemble d'émotions partagées","Comme une réalité qui n'existe que dans les perceptions"]},
 {id:2,q:"Dans la conception informationnelle, un problème de communication est :",a:["Un conflit de valeurs entre les personnes","Un problème de pouvoir uniquement","Un problème technique : la bonne information n'est pas arrivée à la bonne personne au bon moment","Un problème d'interprétation culturelle"]},
 {id:3,q:"Lequel de ces exemples illustre la forme matérielle de l'organisation ?",a:["Prendre l'ascenseur jusqu'au 10e étage pour présenter un rapport à son patron","Notre position hiérarchique qui influence nos rapports aux autres","Le sens que l'on donne à un message","Une négociation d'accord entre collègues"]},
 {id:4,q:"Quel paradoxe montre les limites de l'approche conventionnelle ?",a:["Plus on communique, moins on a de réunions","Plus les organisations grandissent, plus elles communiquent bien","Plus on écrit de courriels, plus les messages sont courts","Plus nos technologies de communication progressent, plus les problèmes de communication persistent"]},
 {id:5,q:"Dans la conception constitutive, la communication est :",a:["Un simple transfert de données entre un émetteur et un récepteur","Le processus fondamental qui crée et négocie le sens et façonne la réalité sociale","Un outil technique réservé aux dirigeants","Un moyen de remplacer les structures de l'organisation"]},
 {id:6,q:"Selon l'approche constitutive, d'où viennent les organisations ?",a:["Elles sont créées par des personnes, à travers la communication","Elles existent dans la nature, comme les arbres ou les rivières","Elles sont des structures neutres qui existent séparément des gens","Elles sont uniquement le produit des bâtiments et des contrats"]},
 {id:7,q:"À propos d'un licenciement, que dit la perspective constitutive ?",a:["Ce n'est qu'une perception, sans réalité concrète","C'est un problème purement matériel","Seule la décision compte, pas la façon de la communiquer","La décision est réelle, mais sa manière, son sens et son interprétation relèvent de la communication"]},
 {id:8,q:"Que représente l'analogie de la Terre plate ?",a:["La communication est impossible dans les grandes organisations","Les organisations sont des lieux géographiques","La vision informationnelle suffit au quotidien, mais pas pour les situations complexes","La communication doit toujours rester simple"]},
 {id:9,q:"Laquelle de ces situations dépasse la simple transmission d'information ?",a:["Afficher un horaire de travail","Confronter quelqu'un qui a mal agi","Envoyer une facture","Transmettre un numéro de téléphone"]},
 {id:10,q:"Selon la conclusion, pourquoi la communication est-elle « organisationnelle » ?",a:["Parce qu'elle se déroule dans une organisation","Parce qu'elle utilise des outils technologiques","Parce qu'elle assemble les activités et interprétations de plusieurs personnes en une forme reconnaissable qui permet l'action collective","Parce qu'elle suit la hiérarchie de l'organisation"]}
];
const $ = id => document.getElementById(id);
const letters=["A","B","C","D"];
let studentName="", studentId="", current=0, correct=0, bonus=0, timerInterval=null, remaining=10, questionStarted=0, locked=false;
let answersLog=[];
function show(section) {
  ["welcome", "quiz", "result", "ranking"].forEach(id => {
    const element = $(id);
    if (element) {
      element.classList.toggle("hidden", id !== section);
    }
  });
}function makeId(){return (crypto.randomUUID?crypto.randomUUID():("id-"+Date.now()+"-"+Math.random().toString(16).slice(2)));}
$("start-form").addEventListener("submit",e=>{
 e.preventDefault(); studentName=$("student-name").value.trim(); if(!studentName)return;
 studentId=localStorage.getItem("quizStudentId")||makeId(); localStorage.setItem("quizStudentId",studentId);
 $("student-label").textContent=studentName; show("quiz"); renderQuestion();
});
function renderQuestion(){
 if(current>=QUESTIONS.length){finish();return;}
 locked=false; const q=QUESTIONS[current]; remaining=10; questionStarted=performance.now();
 $("question-count").textContent=`QUESTION ${String(current+1).padStart(2,"0")} / ${QUESTIONS.length}`;
 $("progress-bar").style.width=`${current/QUESTIONS.length*100}%`;
 $("question-text").textContent=q.q; $("feedback").className="feedback hidden"; $("feedback").textContent="";
 $("answers").innerHTML="";
 q.a.forEach((answer,i)=>{const btn=document.createElement("button");btn.className="answer-btn";btn.innerHTML=`<span class="answer-letter">${letters[i]}</span><span></span>`;btn.querySelector("span:last-child").textContent=answer;btn.addEventListener("click",()=>submitAnswer(i,false));$("answers").appendChild(btn);});
 updateTimer(); clearInterval(timerInterval); timerInterval=setInterval(()=>{remaining=Math.max(0,10-(performance.now()-questionStarted)/1000);updateTimer();if(remaining<=0){clearInterval(timerInterval);submitAnswer(null,true);}},50);
}
function updateTimer(){const pct=Math.max(0,remaining/10*100);$("timer").innerHTML=`${remaining.toFixed(1)} <small>sec</small>`;$("timer-bar").style.width=pct+"%";$("timer-bar").style.background=remaining<=3?"var(--red)":"var(--cyan)";}
async function submitAnswer(choice,timedOut){
 if(locked)return; locked=true;clearInterval(timerInterval);
 const q=QUESTIONS[current], elapsedMs=Math.min(10000,Math.round(performance.now()-questionStarted));
 const buttons=[...$("answers").querySelectorAll("button")];buttons.forEach(b=>b.disabled=true);
 let result;
 try{
  const response=await fetch("/api/answer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId,studentName,questionId:q.id,choice,elapsedMs,timedOut})});
  result=await response.json(); if(!response.ok)throw new Error(result.error||"Erreur serveur");
 }catch(err){
  $("feedback").className="feedback bad";$("feedback").textContent="Impossible d'enregistrer ta réponse. Vérifie ta connexion et actualise la page pour réessayer.";locked=false;return;
 }
 if(result.correct){correct++;if(result.bonusAwarded)bonus++;}
 if(choice!==null){buttons[choice].classList.add(result.correct?"correct":"wrong");}
 if(result.correct && result.bonusAwarded){$("feedback").className="feedback good";$("feedback").textContent="Bonne réponse ! Tu es le/la plus rapide sur cette question : +1 point bonus !";}
 else if(result.correct){$("feedback").className="feedback good";$("feedback").textContent="Bonne réponse ! Le bonus a déjà été remporté par un autre participant.";}
 else{$("feedback").className="feedback bad";$("feedback").textContent=timedOut?"Temps écoulé ! La réponse n'a pas été validée.":`Ce n'est pas la bonne réponse. ${result.explanation||""}`;}
 $("score-live").textContent=`${correct} bonne(s) réponse(s) · ${bonus} bonus`;
 answersLog.push({questionId:q.id,choice,correct:!!result.correct,bonus:!!result.bonusAwarded});
 setTimeout(()=>{current++;renderQuestion();},1600);
}
function finish(){
 clearInterval(timerInterval);show("result");$("result-name").textContent=studentName;
 $("final-score").textContent=`${correct+bonus}/20`;$("correct-score").textContent=`${correct}/10`;$("bonus-score").textContent=`+${bonus}`;
 $("result-message").textContent=bonus?`Bravo ! Tu as obtenu ${bonus} point(s) bonus grâce à ta rapidité.`:"Merci pour ta participation ! Continue à t'entraîner pour décrocher les points bonus.";
}
const backHomeButton = $("back-home");

if (backHomeButton) {
  backHomeButton.addEventListener("click", () => show("welcome"));
}
