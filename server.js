import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors()); app.use(express.json());
let teams = [
 {id:1,name:'Royal Strikers',city:'Davanagere',played:0,won:0,lost:0,points:0},
 {id:2,name:'Thunder XI',city:'Harihara',played:0,won:0,lost:0,points:0},
 {id:3,name:'Warriors CC',city:'Holesirigere',played:0,won:0,lost:0,points:0},
 {id:4,name:'Kings Cricket Club',city:'Jagalur',played:0,won:0,lost:0,points:0}
];
let matches = [
 {id:1,teamA:'Royal Strikers',teamB:'Thunder XI',date:'2026-12-01',venue:'Main Ground',status:'Upcoming',result:''},
 {id:2,teamA:'Warriors CC',teamB:'Kings Cricket Club',date:'2026-12-02',venue:'College Ground',status:'Upcoming',result:''}
];
app.get('/api/health',(req,res)=>res.json({ok:true,message:'Cricket Tournament API is running'}));
app.get('/api/teams',(req,res)=>res.json(teams));
app.post('/api/teams',(req,res)=>{const {name,city}=req.body;if(!name?.trim())return res.status(400).json({message:'Team name is required'});const team={id:Date.now(),name:name.trim(),city:city?.trim()||'—',played:0,won:0,lost:0,points:0};teams.push(team);res.status(201).json(team);});
app.get('/api/matches',(req,res)=>res.json(matches));
app.post('/api/matches',(req,res)=>{const {teamA,teamB,date,venue}=req.body;if(!teamA||!teamB||teamA===teamB)return res.status(400).json({message:'Choose two different teams'});if(!date)return res.status(400).json({message:'Date is required'});const match={id:Date.now(),teamA,teamB,date,venue:venue||'TBD',status:'Upcoming',result:''};matches.push(match);res.status(201).json(match);});
app.post('/api/matches/:id/result',(req,res)=>{const m=matches.find(x=>x.id===Number(req.params.id));if(!m)return res.status(404).json({message:'Match not found'});const {winner}=req.body;if(![m.teamA,m.teamB].includes(winner))return res.status(400).json({message:'Winner must be one of the teams'});if(m.status==='Completed')return res.status(400).json({message:'Result already recorded'});m.status='Completed';m.result=`${winner} won`;teams=teams.map(t=>t.name===m.teamA||t.name===m.teamB?{...t,played:t.played+1,won:t.won+(t.name===winner?1:0),lost:t.lost+(t.name!==winner?1:0),points:t.points+(t.name===winner?2:0)}:t);res.json(m);});
app.listen(5000,()=>console.log('Cricket Tournament API running at http://localhost:5000'));
