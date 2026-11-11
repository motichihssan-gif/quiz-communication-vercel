const ANSWERS = {
 1:{correct:1,explanation:"L'organisation est vue comme un contenant, et la communication comme ce qui circule à l'intérieur."},
 2:{correct:2,explanation:"Pour la vision informationnelle, une mauvaise communication est un problème technique de transmission."},
 3:{correct:0,explanation:"L'ascenseur jusqu'au 10e étage illustre la forme matérielle ; la hiérarchie illustre la forme symbolique."},
 4:{correct:3,explanation:"Si c'était un simple problème technique, de meilleurs outils le résoudraient. Or les problèmes persistent."},
 5:{correct:1,explanation:"La communication crée et négocie les significations et façonne notre réalité sociale."},
 6:{correct:0,explanation:"Les organisations sont créées par des personnes à travers la communication."},
 7:{correct:3,explanation:"La décision est concrète, mais son sens et son interprétation passent par la communication."},
 8:{correct:2,explanation:"La vision informationnelle peut suffire au quotidien, mais elle ne suffit pas pour comprendre les situations complexes."},
 9:{correct:1,explanation:"Confronter quelqu'un ou résoudre un conflit implique une négociation du sens."},
 10:{correct:2,explanation:"La communication assemble les activités et interprétations de plusieurs personnes pour permettre l'action collective."}
};
module.exports = async (req,res) => {
 if(req.method!=="POST")return res.status(405).json({error:"Méthode non autorisée"});
 const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY}=process.env;
 if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY)return res.status(500).json({error:"Configuration Supabase manquante."});
 const {studentId,studentName,questionId,choice,elapsedMs,timedOut}=req.body||{};
 if(typeof studentId!=="string"||studentId.length>80||typeof studentName!=="string"||!studentName.trim()||studentName.length>50||!Number.isInteger(questionId)||!ANSWERS[questionId]||(!timedOut&&(!Number.isInteger(choice)||choice<0||choice>3))||!Number.isFinite(elapsedMs)||elapsedMs<0||elapsedMs>10500)return res.status(400).json({error:"Données de réponse invalides."});
 const item=ANSWERS[questionId], correct=!timedOut&&choice===item.correct;
 try{
  const response=await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_quiz_answer`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_SERVICE_ROLE_KEY,"Authorization":`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`},body:JSON.stringify({p_student_id:studentId,p_student_name:studentName.trim(),p_question_id:questionId,p_choice:timedOut?-1:choice,p_is_correct:correct,p_elapsed_ms:Math.round(elapsedMs)})});
  const data=await response.json();
  if(!response.ok)throw new Error(data.message||"Erreur base de données");
  const row=Array.isArray(data)?data[0]:data;
  return res.status(200).json({correct,bonusAwarded:!!row?.bonus_awarded,explanation:correct?"":item.explanation});
 }catch(error){return res.status(500).json({error:"Impossible d'enregistrer la réponse."});}
};
