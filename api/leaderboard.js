module.exports = async (req,res) => {
 if(req.method!=="GET")return res.status(405).json({error:"Méthode non autorisée"});
 const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY}=process.env;
 if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY)return res.status(500).json({error:"Configuration Supabase manquante."});
 try{
  const r=await fetch(`${SUPABASE_URL}/rest/v1/quiz_leaderboard?select=student_name,correct_count,bonus_count,total_score&order=total_score.desc,correct_count.desc&limit=50`,{headers:{"apikey":SUPABASE_SERVICE_ROLE_KEY,"Authorization":`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`}});
  const data=await r.json();if(!r.ok)throw new Error();
  return res.status(200).json(data);
 }catch(e){return res.status(500).json({error:"Classement indisponible."});}
};
