import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Users, Building2, UserCheck, Calendar, Gift, LayoutDashboard,
  Search, Plus, Edit2, Trash2, ChevronRight, X, Phone, Mail,
  Linkedin, Copy, ArrowLeft, Settings, Menu, Upload, Download,
  Presentation, Clock, CheckCircle2, XCircle, FolderOpen, Folder,
  Briefcase, Filter, Heart, UtensilsCrossed, Tag, MapPin
} from "lucide-react";

const injectFont = () => {
  const l = document.createElement("link"); l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garant:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(l);
};

const uid = () => Math.random().toString(36).slice(2, 9);
const mkm = (d,t,cn,co,ct,bd,am,ml,ld,g,s,ppt=false,n="") => ({
  id:uid(),date:d,time:t,contactNames:cn,company:co,clientType:ct,
  bd,am,meetingLocation:ml,locationDetail:ld,powerpointReady:ppt,
  gifts:g,status:s,notes:n
});


// ─── SORT HOOK ────────────────────────────────────────────────────────────────
const useSort = (data, defaultKey='', defaultDir='asc') => {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);
  const toggle = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let av = a[sortKey] ?? ''; let bv = b[sortKey] ?? '';
      // numeric detection
      if (!isNaN(av) && !isNaN(bv) && av !== '' && bv !== '') {
        return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
      }
      av = String(av).toLowerCase(); bv = String(bv).toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);
  const Th = ({col, label, className='', center=false}) => (
    <th onClick={() => toggle(col)}
      className={`px-3 py-3 cursor-pointer select-none whitespace-nowrap group ${center ? 'text-center' : 'text-left'} ${className}`}>
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`text-xs transition-all ${sortKey === col ? 'text-amber-500' : 'text-gray-200 group-hover:text-gray-400'}`}>
          {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  );
  return { sorted, Th, sortKey, sortDir };
};

// ─── SEED: TEAM ───────────────────────────────────────────────────────────────
const TEAM_SEED = [
  {id:"t1",name:"Ray Lee",role:"BD",title:"Director of Business"},
  {id:"t2",name:"Bryam Jacquet",role:"BD",title:"Head of BD"},
  {id:"t3",name:"Heitor Langa",role:"BD",title:"BDM of LatAm"},
  {id:"t4",name:"Nina Cheng",role:"BD",title:"BDM of EU"},
  {id:"t5",name:"Chu Huang",role:"BD",title:"BDM of Africa, Oceania & N. America"},
  {id:"t6",name:"Sean Liu",role:"AM",title:"Director of AM"},
  {id:"t7",name:"Allen Chiu",role:"AM",title:"Account Manager"},
  {id:"t8",name:"Dahung Chen",role:"AM",title:"Account Manager"},
  {id:"t9",name:"Aisha Kuo",role:"AM",title:"Account Manager"},
  {id:"t10",name:"Silvio Chen",role:"AM",title:"Account Manager"},
  {id:"t11",name:"Steven Chan",role:"AM",title:"Account Manager"},
  {id:"t12",name:"Ray Yang",role:"AM",title:"Account Manager (Ray Jr.)"},
  {id:"t13",name:"Mert Oguz",role:"AM",title:"Account Manager"},
  {id:"t14",name:"Charcy Liu",role:"MKT",title:"Marketing"},
  {id:"t15",name:"Crystal",role:"MKT",title:"Marketing"},
];

// ─── SEED: CONTACTS ───────────────────────────────────────────────────────────
const CONTACTS_SEED = [
  {id:"c1",name:"Eduard Verdaguer",title:"Partnership Manager",company:"Alea",phone:"34606870643",email:"eduard.verdaguer@alea.com",linkedin:"https://www.linkedin.com/in/eduardverdaguergamell/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c2",name:"Ramiro Atucha",title:"CEO",company:"Vibra Gaming",phone:"",email:"ramiro@vibragaming.com",linkedin:"https://www.linkedin.com/in/ramiro-atucha-3a69054/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c3",name:"Federico Saini",title:"CCO",company:"Vibra Gaming",phone:"5491164821100",email:"federico.saini@vibragaming.com",linkedin:"https://www.linkedin.com/in/federico-saini-27199658/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c4",name:"Alex Bolton",title:"Head of Product",company:"Mobinc",phone:"",email:"alex.bolton@mobinc.com",linkedin:"https://www.linkedin.com/in/alexjbolton/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c5",name:"Liza Kundel",title:"Vendor Manager",company:"Slotegrator",phone:"",email:"y.kundel@slotegrator.com",linkedin:"https://www.linkedin.com/in/yelyzaveta-kundel/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c6",name:"Cassandra Dragan",title:"Account Manager",company:"Pariplay",phone:"",email:"cassandra.dragan@pariplaydev.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c7",name:"Karyna Turchyna",title:"Casino Manager",company:"GR8 TECH",phone:"",email:"karyna.turchyna@gr8.tech",linkedin:"https://www.linkedin.com/in/karyna-turchyna-654655153/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c8",name:"William Lovqvist",title:"Account Manager",company:"RAW",phone:"",email:"william.lovqvist@rawgroup.com",linkedin:"https://www.linkedin.com/in/william-lovqvist/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c9",name:"Zhanna",title:"BDM",company:"Linebet",phone:"",email:"zhanna.r@linebet.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c10",name:"Vanna Kraljevic",title:"BDM",company:"Betbazar",phone:"",email:"vk@betbazar.com",linkedin:"https://www.linkedin.com/in/vanna-kraljevic/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c11",name:"Chris Worthington",title:"Head of Casino",company:"BetPAWA",phone:"",email:"chris.worthington@betpawa.com",linkedin:"https://www.linkedin.com/in/mr-chris-worthington/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c12",name:"Dimitri Traarbach",title:"Account Manager",company:"Blitz",phone:"",email:"dimitri@treegames.be",linkedin:"https://www.linkedin.com/in/dimitri-traarbach-53105618b/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c13",name:"Didier de Swert",title:"Digital Product Lead",company:"Golden Palace",phone:"",email:"didier.deswert@goldenpalace.be",linkedin:"https://www.linkedin.com/in/didier-de-swert-78bb5161/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c14",name:"Ian Oven",title:"Head of Business",company:"Timeless Tech",phone:"",email:"ian@timelesstech.io",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c15",name:"Jordan Shelley",title:"Head of Gaming",company:"Entain",phone:"",email:"jordan.shelley@entaingroup.com",linkedin:"https://www.linkedin.com/in/jordan-shelley-604b34134/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c16",name:"Pamela Santos",title:"Casino Manager",company:"Betsul",phone:"5511994151154",email:"pamela@betsul.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c17",name:"Andre Campos",title:"COO",company:"SeguroBet",phone:"558581719633",email:"andrecampos@segurobet.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c18",name:"Hugo Baungartner",title:"CBO",company:"Esportes da Sorte",phone:"5511991087898",email:"hugo@grupoeb.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c19",name:"Anderson Marques",title:"Casino Manager",company:"Aposta Ganha",phone:"5511914580508",email:"andersonmarques@apostaganha.bet",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c20",name:"Joseph Baker",title:"Games Manager",company:"Games Global",phone:"",email:"joseph.barker@gamesglobal.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c21",name:"Fernando Lemos",title:"CRM Manager",company:"Zero Um",phone:"558199340582",email:"fernando.lemos@zeroum.bet",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c22",name:"Kelly Hall",title:"Account Manager",company:"1x2",phone:"",email:"kelly.hall@1x2network.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c23",name:"Inesa Glazaite",title:"CCO",company:"iGP",phone:"35679387181",email:"inesa.glazaite@igamingplatform.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c24",name:"Lincoln Pinto",title:"CEO",company:"Lucky Gaming",phone:"556184732000",email:"lincoln.pinto@luckygaming.com.br",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c25",name:"Dan Cuello",title:"CEO",company:"4PLAY",phone:"558688670544",email:"dan@4play.bet",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c26",name:"Tiago Silva",title:"CBO",company:"Cactus Gaming",phone:"447310171706",email:"tiago.carneiro@cactusgaming.net",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c27",name:"Nick Gabriel",title:"Commercial Director",company:"Roobet",phone:"447809330703",email:"nickg@roobet.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c28",name:"Fernanda Araujo",title:"Product Operations Manager",company:"Estrela Bet",phone:"553189498565",email:"fernanda.araujo@estrelabet.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c29",name:"Pablo Ruiz",title:"Partnership Manager",company:"Alea",phone:"",email:"pablo.ruiz@alea.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c30",name:"Eliane Nunes",title:"CGO",company:"Salsa Technology",phone:"5511968581640",email:"eliane.nunes@salsatechnology.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c31",name:"Aaron Thatcher",title:"Gaming Product Integrations Manager",company:"BET365",phone:"",email:"aaron.thatcher@bet365.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c32",name:"Nataliia Koskovetska",title:"Head of Casino",company:"Gamingtec",phone:"",email:"nataliia.koskovetska@gamingtec.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c33",name:"Amir Gambarov",title:"Product Owner",company:"Fortune Jack",phone:"995555555517",email:"a.gambarov@fortunejack.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c34",name:"Bruno Rodrigues",title:"COO",company:"Betaki",phone:"5511970739673",email:"bruno@betaki.bet.br",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c35",name:"Marcela Trevino",title:"Head of Casino",company:"Lagersoft",phone:"528134027644",email:"marcela.trevino@lagersoft.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c36",name:"Simon Pukl",title:"Head of Product",company:"Gamanza",phone:"",email:"simon.pukl@gamanza.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c37",name:"Yahale Meltzer",title:"COO",company:"Groove Tech",phone:"",email:"yahale@groovetech.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c38",name:"Alina Degtyareva",title:"BDM",company:"BetBoom",phone:"",email:"alina_d@betboom.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c39",name:"Marco La Grutta",title:"Head of Business",company:"Octavian",phone:"",email:"marco.lagrutta@octaviandigital.com",linkedin:"https://www.linkedin.com/in/marco-la-grutta/",dinnerPref:"",giftPref:"",notes:""},
  {id:"c40",name:"Heitor Leal",title:"CCO",company:"NGX",phone:"558191722031",email:"heitor.leal@ngx.bet",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c41",name:"Abram Lekopa",title:"Head of Casino",company:"Royal Solutions",phone:"27784652204",email:"teleko.lekopa@royalsolutions.pro",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c42",name:"Niket Patel",title:"CEO",company:"Bilions",phone:"19178263492",email:"niket@bilions.co",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c43",name:"Valentyn",title:"CRO",company:"Inplaysoft",phone:"447551392497",email:"valentyn@inplaysoft.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c44",name:"Lourdes Lopez",title:"Head of Casino",company:"Rivalo",phone:"",email:"Lourdes.lopez@rivalo.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c45",name:"Ivo Doroteia",title:"CEO",company:"Lotus",phone:"351937360844",email:"ivo@lotusigaming.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c46",name:"Tatiana",title:"Account Manager",company:"SoftGaming",phone:"",email:"",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c47",name:"Nicolas",title:"CEO",company:"Dopa",phone:"",email:"",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c48",name:"Senthil",title:"Head of Gaming",company:"Sunbet",phone:"",email:"",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c49",name:"Tyler",title:"Commercial Manager",company:"Sunbet",phone:"",email:"",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c50",name:"Nicholas Yu",title:"",company:"Betty",phone:"",email:"nyu@betty.com",linkedin:"",dinnerPref:"",giftPref:"",notes:""},
  {id:"c51",name:"Georgios Oikonomou",title:"",company:"Stoiximan",phone:"",email:"g.oikonomou@kaizengaming.com",linkedin:"",dinnerPref:"",giftPref:"",notes:"Kaizen Gaming Group / Stoiximan"},
];

// ─── SEED: COMPANIES ──────────────────────────────────────────────────────────
const COMPANIES_SEED = [
  {id:"co1",name:"1x2",bd:"Heitor Langa",exhibitions:"SBC Lisbon, ICE Barcelona, ICE 2026",status:"Integrating",clientType:"Aggregator",priority:"Medium",mainMarket:"MGA, Brazil, Africa, Europe",workingWith:"Direct"},
  {id:"co2",name:"Alea",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"SBC Lisbon, ICE Barcelona, Sigma Rome, Sigma Sao Paulo 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Europe, Latam, Africa",workingWith:"Direct"},
  {id:"co3",name:"Aposta Ganha",bd:"Heitor Langa",exhibitions:"SBC Lisbon, SBC Rio, Sigma Sao Paulo, ICE 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:"Direct"},
  {id:"co4",name:"Betsson",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"ICE Barcelona, Dubai, Sigma Rome, ICE 2026",status:"Integrating",clientType:"Operator",priority:"Critical ⚠️",mainMarket:"Greece, MGA, Sweden, Chile, Peru, Brazil",workingWith:"Relax"},
  {id:"co5",name:"Betway",bd:"Bryam Jacquet, Nina Cheng, Chu Huang",exhibitions:"Sigma Africa, SBC Lisbon, ICE 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Africa, UK",workingWith:"LNW"},
  {id:"co6",name:"BetPAWA",bd:"Bryam Jacquet, Chu Huang",exhibitions:"iGB Live 2025, ICE 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Africa",workingWith:"Alea"},
  {id:"co7",name:"Cactus Gaming",bd:"Heitor Langa",exhibitions:"SBC Lisbon, ICE 2026, Sigma Sao Paulo 2026",status:"Live",clientType:"Platform",priority:"High",mainMarket:"Curacao, Brazil",workingWith:"Direct"},
  {id:"co8",name:"Entain Group",bd:"Heitor Langa",exhibitions:"SBC Lisbon, Sigma Rome, ICE 2026",status:"Integrating",clientType:"Operator",priority:"High",mainMarket:"ROW",workingWith:"LNW"},
  {id:"co9",name:"Estrela Bet",bd:"Heitor Langa",exhibitions:"SBC Lisbon, SBC Rio, Sigma Sao Paulo, ICE 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:"Alea"},
  {id:"co10",name:"Esportes da Sorte",bd:"Heitor Langa",exhibitions:"SBC Lisbon, ICE 2026, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:"Sportingtech"},
  {id:"co11",name:"Every Matrix",bd:"Bryam Jacquet",exhibitions:"ICE Barcelona, ICE 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Africa, Turkey, Latam",workingWith:""},
  {id:"co12",name:"Flutter",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"Sigma Rome, ICE 2026",status:"Integrating",clientType:"Operator",priority:"High",mainMarket:"Global",workingWith:"Relax"},
  {id:"co13",name:"Games Global",bd:"Nina Cheng, Heitor Langa",exhibitions:"ICE Barcelona, Sigma Rome",status:"Contracting",clientType:"Aggregator",priority:"Medium",mainMarket:"Global",workingWith:"Direct"},
  {id:"co14",name:"Golden Palace",bd:"Nina Cheng",exhibitions:"ICE Barcelona",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Belgium",workingWith:"Direct"},
  {id:"co15",name:"GR8 Tech",bd:"Bryam Jacquet",exhibitions:"ICE Barcelona",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"CIS, Brazil",workingWith:"Direct"},
  {id:"co16",name:"iGP",bd:"Heitor Langa, Nina Cheng",exhibitions:"SBC Lisbon, ICE Barcelona, ICE 2026",status:"Live",clientType:"Platform",priority:"Live, N/A",mainMarket:"Isle of Man, Curacao",workingWith:"Direct"},
  {id:"co17",name:"Inplaysoft",bd:"Heitor Langa",exhibitions:"SBC Lisbon, Sigma Sao Paulo, Sigma Sao Paulo 2026",status:"Live",clientType:"Aggregator",priority:"High",mainMarket:"Brazil",workingWith:"Direct"},
  {id:"co18",name:"Light and Wonder",bd:"Nina Cheng, Chu Huang, Heitor Langa, Bryam Jacquet",exhibitions:"South Africa, iGB Live 2025, Sigma Rome, ICE 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Europe, UK, Africa, SA",workingWith:"LNW"},
  {id:"co19",name:"Lucky Gaming",bd:"Heitor Langa",exhibitions:"SBC Lisbon, ICE Barcelona, ICE 2026, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:"Inplaysoft"},
  {id:"co20",name:"NGX",bd:"Heitor Langa",exhibitions:"SBC Lisbon, SBC Americas FLL, Sigma Sao Paulo 2026",status:"Pending Live",clientType:"Platform",priority:"High",mainMarket:"Brazil",workingWith:"Salsa Tech"},
  {id:"co21",name:"Novibet",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"SBC Lisbon, ICE Barcelona, ICE 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Europe, Latam",workingWith:"EM"},
  {id:"co22",name:"Pronet Gaming",bd:"Bryam Jacquet",exhibitions:"SBC Lisbon, ICE Barcelona, Dubai, ICE 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Turkey, South East Asia",workingWith:"Direct"},
  {id:"co23",name:"Relax Gaming",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"iGB Live 2025, SBC Malta, SBC Lisbon, ICE 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Europe, Turkey, Latam",workingWith:"Direct"},
  {id:"co24",name:"Roobet",bd:"Bryam Jacquet",exhibitions:"SBC Lisbon, ICE 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Mexico, CIS",workingWith:"Slotegrator"},
  {id:"co25",name:"Salsa Technology",bd:"Heitor Langa",exhibitions:"SBC Lisbon, SBC Rio, Sigma Sao Paulo, Sigma Sao Paulo 2026",status:"Live",clientType:"Aggregator",priority:"Low",mainMarket:"Latam",workingWith:"Direct"},
  {id:"co26",name:"SeguroBet",bd:"Heitor Langa",exhibitions:"ICE Barcelona, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Brazil",workingWith:"Betconstruct"},
  {id:"co27",name:"Slotegrator",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"iGB Live 2025, ICE 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Argentina, CIS, Brazil",workingWith:""},
  {id:"co28",name:"Stake",bd:"Heitor Langa, Chu Huang",exhibitions:"Sigma Sao Paulo, ICE Barcelona, Sigma Sao Paulo 2026",status:"Integrating",clientType:"Operator",priority:"High",mainMarket:"Peru, Brazil, Mexico",workingWith:"Direct"},
  {id:"co29",name:"Superbet",bd:"Bryam Jacquet, Nina Cheng, Heitor Langa",exhibitions:"ICE Barcelona, ICE 2026, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Romania, Brazil",workingWith:"BRAGG"},
  {id:"co30",name:"Zero Um",bd:"Heitor Langa",exhibitions:"SBC Lisbon, ICE 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Brazil",workingWith:"Inplaysoft"},
  {id:"co31",name:"4PLAY / PAGOL",bd:"Heitor Langa",exhibitions:"ICE Barcelona, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Latam, Brazil",workingWith:"Direct"},
  {id:"co32",name:"Pixbet",bd:"Heitor Langa",exhibitions:"SBC Lisbon, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:"Softswiss"},
  {id:"co33",name:"Blaze",bd:"Heitor Langa",exhibitions:"SBC Rio, Sigma Sao Paulo, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Curacao, Brazil",workingWith:"Direct"},
  {id:"co34",name:"Rei Do Pitaco",bd:"Chu Huang, Heitor Langa",exhibitions:"SBC Lisbon, SBC Americas FLL, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Latam",workingWith:"Softswiss"},
  {id:"co35",name:"7K",bd:"Heitor Langa",exhibitions:"SBC Lisbon, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"High",mainMarket:"Brazil",workingWith:"Cactus"},
  {id:"co36",name:"Betboom",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:"Direct"},
  {id:"co37",name:"SoftGaming",bd:"Bryam Jacquet",exhibitions:"SiGMA Eurasia Dubai 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Europe, CIS",workingWith:"Direct"},
  {id:"co38",name:"Dopa",bd:"Bryam Jacquet",exhibitions:"SiGMA Eurasia Dubai 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Latam",workingWith:""},
  {id:"co39",name:"Sunbet",bd:"Bryam Jacquet, Chu Huang",exhibitions:"Sigma Cape Town 2026",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"South Africa",workingWith:""},
  {id:"co40",name:"Bragg",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"SBC Lisbon, iGB Live 2025",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"MGA, Curacao, Romania",workingWith:"Direct"},
  {id:"co41",name:"Aposta Tudo",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:"Cactus"},
  {id:"co42",name:"Plugnplay",bd:"Heitor Langa",exhibitions:"SBC Americas FLL, Sigma Sao Paulo 2026",status:"Contracting",clientType:"Platform",priority:"High",mainMarket:"Curacao, Brazil",workingWith:"Direct"},
  {id:"co43",name:"Digiplus",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Pending Live",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:""},
  {id:"co44",name:"Softswiss Brazil",bd:"Heitor Langa",exhibitions:"SBC Lisbon, Sigma Sao Paulo 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Brazil",workingWith:"Direct"},
  {id:"co45",name:"B1Bet",bd:"",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:""},
  {id:"co46",name:"9D",bd:"",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:""},
  {id:"co47",name:"Rivalo",bd:"Heitor Langa",exhibitions:"ICE Barcelona, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Curacao",workingWith:"EM"},
  {id:"co48",name:"Bandbet",bd:"Heitor Langa",exhibitions:"ICE Barcelona, SBC Rio, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Latam, Brazil",workingWith:""},
  {id:"co49",name:"Casa De Apostas",bd:"Heitor Langa",exhibitions:"SBC Rio, Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:"Salsa"},
  {id:"co50",name:"HUB88",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Aggregator",priority:"Low",mainMarket:"Global",workingWith:""},
  {id:"co51",name:"Apuesta Total",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Peru",workingWith:""},
  {id:"co52",name:"Atlantic City",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Peru",workingWith:""},
  {id:"co53",name:"Somos Casino",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Peru",workingWith:""},
  {id:"co54",name:"PalmsBet",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Peru",workingWith:""},
  {id:"co55",name:"LaFija",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Peru",workingWith:""},
  {id:"co56",name:"ANA Gaming",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:""},
  {id:"co57",name:"KTO",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:""},
  {id:"co58",name:"VBET",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:""},
  {id:"co59",name:"NSX",bd:"Heitor Langa",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:""},
  {id:"co60",name:"Superbet Brazil",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Live, N/A",mainMarket:"Brazil",workingWith:"BRAGG"},
  // ── Added from exhibition meetings ──
  {id:"co61",name:"Timeless Tech",bd:"Bryam Jacquet, Heitor Langa",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Latam, Turkey",workingWith:""},
  {id:"co62",name:"Gamingtec",bd:"Bryam Jacquet",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Aggregator",priority:"Medium",mainMarket:"CIS, Europe",workingWith:""},
  {id:"co63",name:"Digitain",bd:"Chu Huang",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Europe, Latam, CIS",workingWith:"Digitain"},
  {id:"co64",name:"IGT",bd:"Nina Cheng",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Global",workingWith:"Direct"},
  {id:"co65",name:"Sportingtech",bd:"Heitor Langa",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Platform",priority:"Live, N/A",mainMarket:"Brazil, Latam",workingWith:"Direct"},
  {id:"co66",name:"Light & Wonder",bd:"Nina Cheng, Chu Huang",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Global",workingWith:"LNW"},
  {id:"co67",name:"GiG",bd:"Heitor Langa",exhibitions:"ICE Barcelona 2026",status:"First Contact",clientType:"Platform",priority:"Medium",mainMarket:"Europe",workingWith:""},
  {id:"co68",name:"Stoiximan",bd:"",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Greece",workingWith:"Kaizen Gaming Group"},
  {id:"co69",name:"OPAP",bd:"",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Greece",workingWith:""},
  {id:"co70",name:"QTech",bd:"Chu Huang",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Aggregator",priority:"Live, N/A",mainMarket:"Asia, Latam",workingWith:"Direct"},
  {id:"co71",name:"Iziplay",bd:"Nina Cheng",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Aggregator",priority:"Medium",mainMarket:"Europe",workingWith:""},
  {id:"co72",name:"Koral Play",bd:"Chu Huang",exhibitions:"ICE Barcelona 2026",status:"Requesting",clientType:"Operator",priority:"Medium",mainMarket:"France, Latam",workingWith:""},
  {id:"co73",name:"Reevo Tech",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Aggregator",priority:"Medium",mainMarket:"Europe",workingWith:""},
  {id:"co74",name:"Reevo (Circus)",bd:"",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co75",name:"BF Games",bd:"Nina Cheng",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Aggregator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co76",name:"Betty",bd:"Chu Huang",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co77",name:"Betvip",bd:"Heitor Langa",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:""},
  {id:"co78",name:"Blitz",bd:"",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Belgium",workingWith:""},
  {id:"co79",name:"Hero Gaming",bd:"Bryam Jacquet, Nina Cheng",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co80",name:"Upgaming",bd:"Bryam Jacquet",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"CIS",workingWith:""},
  {id:"co81",name:"Naibet",bd:"Chu Huang",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Africa",workingWith:""},
  {id:"co82",name:"Multibet",bd:"Heitor Langa",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Africa",workingWith:""},
  {id:"co83",name:"Solverde PT",bd:"",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Portugal",workingWith:""},
  {id:"co84",name:"Broadway (SPRITE)",bd:"Bryam Jacquet",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Aggregator",priority:"Low",mainMarket:"CIS",workingWith:""},
  {id:"co85",name:"eSoftHall",bd:"",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Aggregator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co86",name:"mbit",bd:"",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co87",name:"TCG",bd:"",exhibitions:"ICE Barcelona 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co88",name:"Toto Casino",bd:"Nina Cheng",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Europe",workingWith:""},
  {id:"co89",name:"Bally's",bd:"Nina Cheng, Bryam Jacquet",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Europe, USA",workingWith:""},
  {id:"co90",name:"Betnacional",bd:"Heitor Langa, Ray Lee",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:""},
  {id:"co91",name:"Oddsgates",bd:"Heitor Langa, Ray Lee",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Platform",priority:"Medium",mainMarket:"Brazil",workingWith:""},
  {id:"co92",name:"HiperBet",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"Brazil",workingWith:""},
  {id:"co93",name:"DonaldBet",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:"Cactus"},
  {id:"co94",name:"4Win",bd:"Heitor Langa",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:""},
  {id:"co95",name:"A2FBR",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Live",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:"Softswiss"},
  {id:"co96",name:"Aprieta Y Gana",bd:"Heitor Langa, Bryam Jacquet",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Latam",workingWith:""},
  {id:"co97",name:"BRBET",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:""},
  {id:"co98",name:"BrazilVegas",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Marketing",priority:"Low",mainMarket:"Brazil",workingWith:""},
  {id:"co99",name:"Yogonet",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Marketing",priority:"Low",mainMarket:"Global",workingWith:""},
  {id:"co100",name:"Focus Gaming News",bd:"Heitor Langa, Bryam Jacquet",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Marketing",priority:"Low",mainMarket:"Global",workingWith:""},
  {id:"co101",name:"Argentina (Law Firm)",bd:"Heitor Langa, Chu Huang",exhibitions:"ICE Barcelona 2026",status:"Contact",clientType:"Law Firm",priority:"Low",mainMarket:"Argentina",workingWith:""},
  {id:"co102",name:"Betbra",bd:"Heitor Langa",exhibitions:"Sigma Sao Paulo 2026",status:"Contact",clientType:"Operator",priority:"Low",mainMarket:"Brazil",workingWith:""},
];

// ─── CHU CSV: 743 ADDITIONAL CONTACTS ────────────────────────────────────────
// 743 new contacts from Chu CSV
const CHU_CSV_CONTACTS = [
  {id:uid(),name:'A Pavlou',title:'',company:'Kaizen Gaming',phone:'',email:'a.pavlou@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'A Portelli',title:'',company:'Betclic Group',phone:'',email:'a.portelli@betclicgroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'A Raj',title:'',company:'Gaming Labs',phone:'',email:'a.raj@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'A Ruiz Ocana',title:'',company:'Gaming Labs',phone:'',email:'a.ruiz-ocana@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'A Tolstov',title:'',company:'Torrero',phone:'',email:'a.tolstov@torrero.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Aaryendra Kashyap',title:'',company:'Gaming Labs',phone:'',email:'a.kashyap@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Abdulmenaf Kasap',title:'',company:'Pronet',phone:'',email:'abdulmenaf.kasap@sportdevops.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Adam Ruffett',title:'',company:'Livescore',phone:'',email:'adam.ruffett@livescore.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Adria Gutierrez',title:'',company:'Alea',phone:'',email:'adria.gutierrez@alea.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Agatha QT',title:'',company:'Qtech Games',phone:'',email:'agatha@qtechgames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Agustin Martinez',title:'',company:'Gaming Labs',phone:'',email:'ag.martinez@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Aguzik',title:'',company:'Spribe',phone:'',email:'aguzik@spribe.co',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Aguzzon',title:'',company:'LNW',phone:'',email:'aguzzon@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ahikam Raviv',title:'',company:'Notix',phone:'',email:'a.raviv@notix.games',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ahmed Baker',title:'',company:'Incentive Games',phone:'',email:'ahmed.baker@incentivegames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Aleksandar',title:'',company:'Timelesstech',phone:'',email:'aleksandar@timelesstech.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Aleksandra Efros',title:'',company:'Bankfrick',phone:'',email:'aleksandra.efros@bankfrick.co.uk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Aleksandre Magradze',title:'',company:'Broadway Platform',phone:'',email:'amagradze@broadwayplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alessandra Abreu',title:'',company:'Cometa Gaming',phone:'',email:'alessandra.abreu@cometagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alessandro Dutto',title:'',company:'GLI Secure',phone:'',email:'a.dutto@glisecure.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alessandro Rainaldi',title:'',company:'Lottomatica',phone:'',email:'a.rainaldi@lottomatica.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alessandro Sposito',title:'',company:'iGaming Platform',phone:'',email:'alessandro.sposito@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alex Cai',title:'',company:'Gamekong',phone:'',email:'cai.a@brainrocket.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alex Myers',title:'',company:'Solutionshub',phone:'',email:'alex.myers@solutionshub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexander Chow',title:'',company:'Entain Group',phone:'',email:'alexander.chow2@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandra Caplea',title:'',company:'Everymatrix',phone:'',email:'alexandra.caplea@everymatrix.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandra Dedu',title:'',company:'iGaming Platform',phone:'',email:'alexandra.dedu@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandra Nae',title:'',company:'Alea',phone:'',email:'alexandra.nae@alea.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandra Petca',title:'',company:'Flutter',phone:'',email:'alexandra.petca@flutter.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandra Yankevich',title:'',company:'Notix',phone:'',email:'a.yankevich@notix.games',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandre Araujo | PlugNPlay',title:'',company:'Plugnplay',phone:'',email:'alexandre.araujo@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandre Fedullo',title:'',company:'Flutter',phone:'',email:'alexandre.fedullo@flutter.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandre PAQUE',title:'',company:'Koralplay',phone:'',email:'alex@koralplay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandros Karaoulis',title:'',company:'Lynon',phone:'',email:'alexandros.karaoulis@lynon.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alexandru Iulian Radu',title:'',company:'Kaizen Gaming',phone:'',email:'a.radu@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alin Dinu',title:'',company:'Win Bet',phone:'',email:'alin.dinu@winbet.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alina Tace',title:'',company:'Whsimion Partners',phone:'',email:'alina.tace@whsimionpartners.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Alper',title:'',company:'Pronet Gaming',phone:'',email:'alper@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Amalia Chavari',title:'',company:'Kaizen Gaming',phone:'',email:'a.chavari@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Amanda Alexandrini',title:'',company:'Bragg',phone:'',email:'amanda.alexandrini@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Amber Howlett',title:'',company:'Gaming Labs',phone:'',email:'a.howlett@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Amiee Gouder',title:'',company:'Gamekong',phone:'',email:'gouder.a@brainrocket.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ana Carolina Amorim Honorato da Silva',title:'',company:'Apostaganha',phone:'',email:'anacarolinaamorim@apostaganha.bet',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anabelle Buttigieg',title:'',company:'Sparkasse Bank Malta',phone:'',email:'anabelle.buttigieg@sparkasse-bank-malta.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anaelle Denys',title:'',company:'Koralplay',phone:'',email:'anaelle.denys@koralplay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anahit Nahapetyan',title:'',company:'Gr8',phone:'',email:'anahit.nahapetyan@gr8.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anastasia Juc',title:'',company:'Relax  Gaming',phone:'',email:'anastasia.juc@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anastasiia Dylevska',title:'',company:'Gamingtec',phone:'',email:'a.dylevska@gamingtec.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anastasiya Mokrova',title:'',company:'Most Bet',phone:'',email:'a.mokrova@double.global',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anastasiya Navitskaya',title:'',company:'ZF Casino',phone:'',email:'a.navitskaya@zfcasino.by',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andra Ignat',title:'',company:'Reevotech',phone:'',email:'andra.ignat@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andre Caruana',title:'',company:'iGaming Platform',phone:'',email:'andre.caruana@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andre Nogueira',title:'',company:'Bet MGM',phone:'',email:'andre.nogueira@betmgm.com.br',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andreea Roxana',title:'',company:'Reevotech',phone:'',email:'andreea.roxana@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andrei Bularca',title:'',company:'Everymatrix',phone:'',email:'andrei.bularca@everymatrix.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andrej Grechiha',title:'',company:'Softswiss',phone:'',email:'andrej.grechiha@softswiss.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andrew Muir',title:'',company:'Playtech',phone:'',email:'andrew.muir@playtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Andriana Vasileiou',title:'',company:'Kaizen Gaming',phone:'',email:'a.vasileiou@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Angela Chen',title:'',company:'Pronet Gaming',phone:'',email:'angela.c@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Angelina Kharchenko',title:'',company:'Slotegrator',phone:'',email:'a.kharchenko@slotegrator.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ani Khachatryan',title:'',company:'Betconstruct',phone:'',email:'ani.khachatryan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Aniket Gupta',title:'',company:'WH Partners',phone:'',email:'aniket.gupta@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anli Kotze',title:'',company:'Sporty Bet',phone:'',email:'anli.kotze@sporty.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ann',title:'',company:'Openbox Gaming',phone:'',email:'ann@openboxgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anna',title:'',company:'Pronet Gaming',phone:'',email:'anna@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anna Arakelyan',title:'',company:'Betfounders',phone:'',email:'anna.arakelyan@betfounders.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anna Kiselova',title:'',company:'Digitain',phone:'',email:'anna.kiselova@relum.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anne Marie Harman',title:'',company:'Gaming Law LatAm',phone:'',email:'aharman@fonseca.pe',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anthony Murphy',title:'',company:'Sportingtech',phone:'',email:'anthony.murphy@sportingtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Antoinette Caruana',title:'',company:'Sportingtech',phone:'',email:'antoinette.caruana@sportingtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anton Mamaev',title:'',company:'Most Bet',phone:'',email:'a.mamaev@double.global',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Antonino Santangelo',title:'',company:'Gaming Labs',phone:'',email:'a.santangelo@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Antonio Dondarza',title:'',company:'Gran Madrid',phone:'',email:'antonio.dondarza@granmadrid.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Anum Fayyaz',title:'',company:'Gaming Associates',phone:'',email:'anum.fayyaz@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Apsichogios',title:'',company:'Novibet',phone:'',email:'apsichogios@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Areg Sedrakyan',title:'',company:'Betconstruct',phone:'',email:'areg.sedrakyan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Arevik Garslian',title:'',company:'Digitain',phone:'',email:'arevik.garslian@relum.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Arijus Denisovas',title:'',company:'Aardvark',phone:'',email:'arijus.denisovas@aardvark.technology',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ark Mobiize',title:'',company:'Mobiize',phone:'',email:'ark@mobiize.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Arman Aghajanyan',title:'',company:'Betconstruct',phone:'',email:'arman.aghajanyan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Arsal Sana',title:'',company:'Gaming Associates',phone:'',email:'arsal.sana@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Artur',title:'',company:'Betfounders',phone:'',email:'artur@betfounders.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Asad Gafoor',title:'',company:'Playtsogo',phone:'',email:'asad.gafoor@playtsogo.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Asen Kobilarov',title:'',company:'Betora',phone:'',email:'asen@betora.global',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ashley Bloor',title:'',company:'Aristocrat',phone:'',email:'ashley.bloor@aristocrat.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Atepsic',title:'',company:'Vixio',phone:'',email:'atepsic@vixio.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Avier Pastrana',title:'',company:'Gran Madrid',phone:'',email:'avier.pastrana@granmadrid.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Avishka Horilal',title:'',company:'Bet Software',phone:'',email:'avishkah@betsoftware.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Axel Jambring',title:'',company:'Hero Gaming',phone:'',email:'axel.jambring@herogaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ayla Haverkamp',title:'',company:'Joi Gaming',phone:'',email:'ayla.haverkamp@joigaming.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Azeez Oloyede',title:'',company:'GLI Secure',phone:'',email:'a.oloyede@glisecure.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Azeez Oloyede (Bulletproof)',title:'',company:'Bulletproof SA Licensor',phone:'',email:'azeez.oloyede@bulletproofsi.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Barbara Ishmael at MGA',title:'',company:'MGA',phone:'',email:'ishmael.barbara@mga.org.mt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Beatriz Ospina Varon',title:'',company:'Gaming Labs',phone:'',email:'b.ospinavaron@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Benjamin Tharratt',title:'',company:'Hollywoodbets',phone:'',email:'benjamint@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Betfounders Info',title:'',company:'Betfounders',phone:'',email:'info@betfounders.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'BetToMax',title:'',company:'Bettomax',phone:'',email:'marcus@bettomax.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Bianca Humphrey',title:'',company:'eCogra',phone:'',email:'bianca@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Birgit Varv',title:'',company:'Lottoland',phone:'',email:'birgit.varv@lottoland.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Bjimenez',title:'',company:'LNW',phone:'',email:'bjimenez@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Bogdan Belomestnykh',title:'',company:'BVNK',phone:'',email:'bogdan.belomestnykh@bvnk.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Bogdan Calin',title:'',company:'Super Bet',phone:'',email:'bogdan.calin@superbet.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Bogdan Negrila',title:'',company:'Super Bet',phone:'',email:'bogdan.negrila@superbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Brady Sammut',title:'',company:'WH Partners',phone:'',email:'brady.sammut@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Brella',title:'',company:'Gaming Soft',phone:'',email:'brella@gamingsoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Britney Ndobe',title:'',company:'eCogra',phone:'',email:'britney.ndobe@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Bruno Lacerda',title:'',company:'Playtech',phone:'',email:'bruno.lacerda@playtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Business Mobiize',title:'',company:'Mobiize',phone:'',email:'business@mobiize.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cajsa Orlander',title:'',company:'Relax  Gaming',phone:'',email:'cajsa.orlander@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Camila Pereira',title:'',company:'Inplay Soft',phone:'',email:'camila.pereira@inplaysoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Camila Pereira',title:'',company:'Jogoprincipal',phone:'',email:'camila_p@jogoprincipal.com.br',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cammisano Giovanna',title:'',company:'Loto-Qu?bec',phone:'',email:'giovanna.cammisano@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Carlos Fonseca Sarmiento',title:'',company:'Gaming Law LatAm',phone:'',email:'carlos@fonseca.pe',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Carmem Soares',title:'',company:'Apostaganha',phone:'',email:'carmemsoares@apostaganha.bet',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Carol Johnstone',title:'',company:'Gaming Labs',phone:'',email:'c.johnstone@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Caroline Lima',title:'',company:'Qtech Games',phone:'',email:'caroline@qtechgames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Casino Engine',title:'',company:'Everymatrix',phone:'',email:'casinoengine@everymatrix.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Casino Partnerships',title:'',company:'Kaizen Gaming',phone:'',email:'casino_partnership@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Casino Vendors',title:'',company:'EGT  Digital',phone:'',email:'casino.vendors@egt-digital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Catalin Veliscu',title:'',company:'Whsimion Partners',phone:'',email:'catalin.veliscu@whsimionpartners.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Caterina Nicola',title:'',company:'Euro Bet',phone:'',email:'caterina.nicola@eurobet.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'CEO Machete',title:'',company:'Machete',phone:'',email:'ceo@machete.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cesar Inca Perez',title:'',company:'Gaming Law LatAm',phone:'',email:'cinca@fonseca.pe',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Chance Millett Bangs',title:'',company:'Entain Group',phone:'',email:'chance.millett-bangs@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Charles Fourie',title:'',company:'eCogra',phone:'',email:'charlesfourie@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Charly VIGNON',title:'',company:'Betclic Group',phone:'',email:'c.vignon@betclicgroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cherise Pillay',title:'',company:'Hollywoodbets',phone:'',email:'cherisep@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Chris',title:'',company:'1X2 Network',phone:'',email:'chris@1x2network.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Chris Fangman',title:'',company:'Keyfin Management',phone:'',email:'chris@keyfinmanagement.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Chris Kambourov',title:'',company:'Gamekong',phone:'',email:'kambourov.c@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Chris Worthington',title:'',company:'Pawatech',phone:'',email:'chris.worthington@pawatech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Christian Crawford',title:'',company:'Poker Stars',phone:'',email:'christian_crawford@pokerstarsint.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Christina Kiousi',title:'',company:'Kaizen Gaming',phone:'',email:'c.kiousi@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Christoffer',title:'',company:'Bejoynd',phone:'',email:'christoffer@bejoynd.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Christoffer Mellden',title:'',company:'Bejoynd',phone:'',email:'christoffer.mellden@bejoynd.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Chryssa Linardaki',title:'',company:'Stoiximan',phone:'',email:'c.linardaki@stoiximan.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Claire Grainger',title:'',company:'Super Group',phone:'',email:'claire.grainger@supergroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Claudiapinheiro',title:'',company:'Solverde',phone:'',email:'claudiapinheiro@solverde.pt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Claudio Botas',title:'',company:'Plugnplay',phone:'',email:'claudio.botas@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Clement Aubin',title:'',company:'Loto-Qu?bec',phone:'',email:'clement.aubin@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Clientreview',title:'',company:'Finductive',phone:'',email:'clientreview@finductive.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Colin Jones',title:'',company:'Vallettapay',phone:'',email:'cj@vallettapay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Connall Sexton',title:'',company:'Immense Group (Ontario Agent)',phone:'',email:'connall.sexton@immensegroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cosmin Gabriel Sulita',title:'',company:'Kaizen Gaming',phone:'',email:'c.sulita@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Couture Martin',title:'',company:'Loto-Qu?bec',phone:'',email:'martin.couture@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Craigo',title:'',company:'Betway',phone:'',email:'craigo@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cristian Doroftei',title:'',company:'Everymatrix',phone:'',email:'cristian.doroftei@everymatrix.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cristina Sichim',title:'',company:'Everymatrix',phone:'',email:'cristina.sichim@everymatrix.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Cvetomir Krumov',title:'',company:'Delasport',phone:'',email:'cvetomir.krumov@delasport.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dragos Draghita',title:'',company:'Kaizen Gaming',phone:'',email:'d.draghita@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Damien',title:'',company:'ZF',phone:'',email:'damien@iamzenith.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Daniel Cuc',title:'',company:'Reevotech',phone:'',email:'daniel.cuc@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Daniel Mashabela',title:'',company:'Gaming Labs',phone:'',email:'d.mashabela@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Daniel Pedersen',title:'',company:'Bettomax',phone:'',email:'d.pedersen@bettomax.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Daniel Woods',title:'',company:'Betsson Group',phone:'',email:'daniel.woods@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Daniela Santos',title:'',company:'Lebull',phone:'',email:'daniela.santos@lebull.pt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Darren Oflaherty',title:'',company:'Leovegas',phone:'',email:'darren.oflaherty@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Darrenc',title:'',company:'Roo Bet',phone:'',email:'darrenc@roobet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David',title:'',company:'Pegasus Gaming',phone:'',email:'david@pegasusgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David Antony Neves Salvador',title:'',company:'Apostaganha',phone:'',email:'davidantony@apostaganha.bet',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David Ciolovan',title:'',company:'IGT',phone:'',email:'david.ciolovan@igt.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David Flood',title:'',company:'Machete',phone:'',email:'david@machete.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David Kakabadze',title:'',company:'Spribe',phone:'',email:'dkakabadze@spribe.co',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David Magri',title:'',company:'WH Management',phone:'',email:'david.magri@whmanagement.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David Magri',title:'',company:'WH Partners',phone:'',email:'david.magri@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'David Zammit',title:'',company:'Vallettapay',phone:'',email:'dz@vallettapay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dayaneoliveira',title:'',company:'Betvip',phone:'',email:'dayaneoliveira@betvip.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dayle Fenton',title:'',company:'BV  Group',phone:'',email:'dayle.fenton@bv-group.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Debbie Guivisdalsky',title:'',company:'Codere',phone:'',email:'debbie.guivisdalsky@codere.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Delgado Ayllon Mariana',title:'',company:'Loto Quebec',phone:'',email:'mariana.delgadoayllon@loto-quebec.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Denkay Basel',title:'',company:'Sportingtech',phone:'',email:'denkay.basel@sportingtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Deron Van Staden',title:'',company:'WSB',phone:'',email:'deron@wsb.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dgvajaia',title:'',company:'Up Gaming',phone:'',email:'dgvajaia@upgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dianne',title:'',company:'Qtech Games',phone:'',email:'dianne@qtechgames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Diego Garcia',title:'',company:'Fiveforfive',phone:'',email:'diego.garcia@fiveforfive.com.br',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dino Zadnikar',title:'',company:'Bragg',phone:'',email:'dino.zadnikar@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dirk Camilleri',title:'',company:'iGaming Platform',phone:'',email:'dirk.camilleri@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dmitryp',title:'',company:'Leon Gaming',phone:'',email:'dmitryp@leongaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dom?nico Ram?rez',title:'',company:'Gaming Law LatAm',phone:'',email:'dfonseca@fonseca.pe',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dragos Popescu',title:'',company:'Super Bet',phone:'',email:'dragos.popescu@superbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Drobaxa I',title:'',company:'Adva Bet',phone:'',email:'drobaxa.i@advabet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Due Diligence',title:'',company:'Relax  Gaming',phone:'',email:'duediligence@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Due Diligence at MGA',title:'',company:'MGA',phone:'',email:'duediligence.mga@mga.org.mt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Dylan Cullen',title:'',company:'Betfair',phone:'',email:'dylan.cullen@betfair.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'E Studio',title:'',company:'Gaming Law LatAm',phone:'',email:'estudio@fonseca.pe',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ebarrett',title:'',company:'LNW',phone:'',email:'ebarrett@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'ecalleja@leongaming.com',title:'',company:'Leon Gaming',phone:'',email:'ecalleja@leongaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ediotallevi',title:'',company:'LNW',phone:'',email:'ediotallevi@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Eduard Cucinschi',title:'',company:'Win Bet',phone:'',email:'eduard.cucinschi@winbet.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Edwing Cabanas',title:'',company:'Lagersoft',phone:'',email:'edwing.cabanas@lagersoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ehall',title:'',company:'LNW',phone:'',email:'ehall@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ekansh Tyagi',title:'',company:'Gaming Labs',phone:'',email:'e.tyagi@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ekaterina Glushenko',title:'',company:'Notix',phone:'',email:'k.glushenko@notix.games',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ekaterina M',title:'',company:'Qtech Games',phone:'',email:'ekaterina@qtechgames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ekin Karaeke',title:'',company:'Everymatrix',phone:'',email:'ekin.karaeke@everymatrix.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Elena Antoni',title:'',company:'Timelesstech',phone:'',email:'elena@timelesstech.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Elix Lopez Peralta',title:'',company:'Relax  Gaming',phone:'',email:'elix.lopez@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Emanuele Morante',title:'',company:'Microgame',phone:'',email:'emanuele.morante@microgame.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'EMEA PMO',title:'',company:'Bulletproof SA Licensor',phone:'',email:'pmo-emea@bulletproofsi.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'EMEIA Accounting',title:'',company:'Gaming Labs',phone:'',email:'emeiabilling@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'EMEIA Sales-Support',title:'',company:'Gaming Labs',phone:'',email:'emeiasales-support@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'EMEIA-PMO',title:'',company:'GLI Secure',phone:'',email:'emeia-pmo@glisecure.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Emil B',title:'',company:'Midzone Group',phone:'',email:'emil.b@midzonegroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Emilio Llames',title:'',company:'Blaze',phone:'',email:'emilio.llames@blaze.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Emmanouela Asimakopoulou',title:'',company:'Stoiximan',phone:'',email:'e.asimakopoulou@stoiximan.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Enrique Borrego',title:'',company:'Calimaco',phone:'',email:'enrique.borrego@calimaco.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ergio Ruperez',title:'',company:'Gran Madrid',phone:'',email:'ergio.ruperez@granmadrid.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Eugen Cojocaru',title:'',company:'Reevotech',phone:'',email:'eugen.cojocaru@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Evangelos Dedoulis',title:'',company:'Kaizen Gaming',phone:'',email:'e.dedoulis@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'F Drosou',title:'',company:'Kaizen Gaming',phone:'',email:'f.drosou@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fabio Denegri',title:'',company:'Betsson Group',phone:'',email:'fabio.denegri@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fabiola Lucero Diaz Vitela',title:'',company:'Lagersoft',phone:'',email:'fabiola.diaz@lagersoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fadi Hirmiz',title:'',company:'Plannatech',phone:'',email:'fadi.hirmiz@plannatech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fatima Akbar',title:'',company:'Gaming Associates',phone:'',email:'fatima.akbar@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fatima Mushtaq',title:'',company:'Gaming Associates',phone:'',email:'fatima.mushtaq@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fatima Nasir Khan',title:'',company:'Gaming Associates',phone:'',email:'fatima.khan@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fcondoleo',title:'',company:'LNW',phone:'',email:'fcondoleo@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'fin fin',title:'',company:'Infingame',phone:'',email:'fin@infingame.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fiona Parry',title:'',company:'Gaming Labs',phone:'',email:'f.parry@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fiordi Paolo',title:'',company:'Sisal',phone:'',email:'paolo.fiordi@sisal.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Flavia Mincu',title:'',company:'Whsimion Partners',phone:'',email:'flavia.mincu@whsimionpartners.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fmatthaiou',title:'',company:'Novibet',phone:'',email:'fmatthaiou@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Fotis Variatzas',title:'',company:'Kaizen Gaming',phone:'',email:'f.variatzas@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Francesco Cinquegrani',title:'',company:'Betfair',phone:'',email:'francesco.cinquegrani@betfair.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Francesco Cuzzupoli',title:'',company:'Microgame',phone:'',email:'francesco.cuzzupoli@microgame.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Franck Bienaime',title:'',company:'Koralplay',phone:'',email:'franck.bienaime@koralplay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Francois Casgrain',title:'',company:'Usoft Gaming',phone:'',email:'frank@usoftgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Francois Gautier',title:'',company:'Koralplay',phone:'',email:'francois.gautier@koralplay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Frank Douthwaite',title:'',company:'Gamico',phone:'',email:'frank@gamico.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Frank Douthwaite',title:'',company:'Solutionshub',phone:'',email:'frank@solutionshub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'G Anestis',title:'',company:'Opap',phone:'',email:'g.anestis@opap.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'G B',title:'',company:'Royal Sweet',phone:'',email:'g.b@royal-sweet.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'G Gvenetadze',title:'',company:'Flutter (Central and Easter Europe)',phone:'',email:'g.gvenetadze@adjarabet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'G Sideridis',title:'',company:'Stoiximan',phone:'',email:'g.sideridis@stoiximan.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gabriela Trevino',title:'',company:'Lagersoft',phone:'',email:'gabriela.trevino@bet4.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gabriela Trevino',title:'',company:'Lagersoft',phone:'',email:'gabriela.trevino@lagersoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gabriele Girgenti',title:'',company:'Iziplay',phone:'',email:'gabriele.girgenti@iziplay.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gabriella Leanne Davies',title:'',company:'Leovegas',phone:'',email:'gabriella.davies@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gayane Sargsyan Misha',title:'',company:'Digitain',phone:'',email:'gayane.sargsyan.m@relum.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gbianco',title:'',company:'LNW',phone:'',email:'gbianco@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gcautiero',title:'',company:'LNW',phone:'',email:'gcautiero@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Geanina Oprita',title:'',company:'Kaizen Gaming',phone:'',email:'g.oprita@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gema Rodriguez',title:'',company:'Casimba Gaming',phone:'',email:'gema.rodriguez@casimbagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'George Olekszy',title:'',company:'Betty',phone:'',email:'golekszy@betty.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Georgia Kallimani',title:'',company:'Stoiximan',phone:'',email:'g.kallimani@stoiximan.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Georgios Oikonomou',title:'',company:'Kaizen Gaming',phone:'',email:'g.oikonomou@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Georgios Sideridis',title:'',company:'N1 Casino',phone:'',email:'georgios.sideridis@n1casino.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Georgios Sideridis',title:'',company:'N1Affiliates',phone:'',email:'georgios.sideridis@n1affiliates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gerasimos Samatas',title:'',company:'Kaizen Gaming',phone:'',email:'g.samatas@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gferrentino',title:'',company:'Tukopro',phone:'',email:'gferrentino@tukopro.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gina Lama',title:'',company:'Pronet Gaming',phone:'',email:'gina.lama@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Glenn Zammit',title:'',company:'WH Management',phone:'',email:'glenn.zammit@whmanagement.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'GLI South Africa QA Team Hanifa',title:'',company:'Gaming Labs',phone:'',email:'gli-za-qa-t1@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'GLI South Africa QA Team Leigh-Anne',title:'',company:'Gaming Labs',phone:'',email:'gli-za-qa-t3@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'GLI South Africa QA Team Megan',title:'',company:'Gaming Labs',phone:'',email:'gli-za-qa-t2@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gnedelea',title:'',company:'LNW',phone:'',email:'gnedelea@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gor Chatyan',title:'',company:'Betconstruct',phone:'',email:'gor.chatyan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gorfanakis',title:'',company:'Novibet',phone:'',email:'gorfanakis@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gourdet Sacha',title:'',company:'Loto-Qu?bec',phone:'',email:'sacha.gourdet@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Greg Glossop',title:'',company:'HWB',phone:'',email:'gregg@starfactory.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Grega Hocevar',title:'',company:'Alea',phone:'',email:'grega.hocevar@alea.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Grepaci',title:'',company:'LNW',phone:'',email:'grepaci@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gtatari',title:'',company:'Novibet',phone:'',email:'gtatari@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Gtiniakos',title:'',company:'Novibet',phone:'',email:'gtiniakos@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'GV',title:'',company:'Betgamings',phone:'',email:'gv@betgamings.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'H Baghirov',title:'',company:'Vegangster',phone:'',email:'h.baghirov@vegangster.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hailee Cook',title:'',company:'Super Group',phone:'',email:'hailee.cook@supergroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Haileec',title:'',company:'Betway',phone:'',email:'haileec@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hamed Rahimi',title:'',company:'Betora',phone:'',email:'hamed@betora.global',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hanifa Khan',title:'',company:'Gaming Labs',phone:'',email:'h.khan@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hardy Francois',title:'',company:'Loto-Qu?bec',phone:'',email:'francois.hardy@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Harvey',title:'',company:'Xsoftline',phone:'',email:'harvey@xsoftline.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Headofcasino',title:'',company:'Gamekong',phone:'',email:'headofcasino@brainrocket.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Henrik Krieger',title:'',company:'Rootz',phone:'',email:'henrik.krieger@rootz.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Henry',title:'',company:'Bingob',phone:'',email:'henry@bingob.com.ph',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Henry van Vuuren',title:'',company:'WSB',phone:'',email:'henry@wsb.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Heorhii Shatilov',title:'',company:'Gamekong',phone:'',email:'shatilov.h@brainrocket.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ho-wing Ma',title:'',company:'Gaming Labs',phone:'',email:'h.ma@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hristofor Hristoc',title:'',company:'Bragg',phone:'',email:'hristofor.hristoc@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hristofor Hristov',title:'',company:'Bragg',phone:'',email:'hristofor.hristov@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hugo Baungartner',title:'',company:'Apostaganha',phone:'',email:'hugo@apostaganha.bet',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hugo Cotrim',title:'',company:'IGT',phone:'',email:'hugo.cotrim@igt.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Hugo Henrique Ribeiro Silva',title:'',company:'Cactus Gaming',phone:'',email:'hugo.ribeiro@cactusgaming.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'I Bakunovich',title:'',company:'ZF Casino',phone:'',email:'i.bakunovich@zfcasino.by',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'I Mikiashili',title:'',company:'Flutter (Central and Easter Europe)',phone:'',email:'i.mikiashili@adjarabet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'I Muravyev',title:'',company:'Slotegrator',phone:'',email:'i.muravyev@slotegrator.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'I Pakhiyanina',title:'',company:'Infingame',phone:'',email:'i.pakhiyanina@infingame.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ian Nicholls',title:'',company:'Tote',phone:'',email:'ian.nicholls@tote.co.uk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Igkiaouraki',title:'',company:'Novibet',phone:'',email:'igkiaouraki@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'IGT.ISB.Billing',title:'',company:'IGT',phone:'',email:'isbbilling@igt.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ilya',title:'',company:'Axis Easy Prosper',phone:'',email:'ilya@axiseasyprosper.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Info',title:'',company:'Bankfrick',phone:'',email:'info@bankfrick.co.uk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Inna Lukina',title:'',company:'Softgamings',phone:'',email:'inna.lukina@softgamings.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Invoice',title:'',company:'Nordicgambling',phone:'',email:'invoice@nordicgambling.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Invoices Novibet',title:'',company:'Novibet',phone:'',email:'invoices@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ioannis Mavrofridis',title:'',company:'Alpha Omega',phone:'',email:'imavrofridis@alpha-omega.ai',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Irshan Omar',title:'',company:'Finductive',phone:'',email:'irshan.omar@finductive.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Isabella Scott',title:'',company:'Gaming Associates',phone:'',email:'isabella.scott@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ivan Belic',title:'',company:'Pronet Gaming',phone:'',email:'ivan.belic@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ivan Carta',title:'',company:'Snai tech',phone:'',email:'ivan.carta@snaitech.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ivan Zhuk',title:'',company:'Softswiss',phone:'',email:'ivan.zhuk@softswiss.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Izabella Muradyan',title:'',company:'Softswiss',phone:'',email:'izabella.muradyan@softswiss.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'J Filagina',title:'',company:'Infingame',phone:'',email:'j.filagina@infingame.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jack Horrocks',title:'',company:'Relax  Gaming',phone:'',email:'jack.horrocks@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jacob',title:'',company:'Xsoftline',phone:'',email:'jacob@xsoftline.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jacopo',title:'',company:'Qtech Games',phone:'',email:'jacopo@qtechgames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jade Ricciardi',title:'',company:'Pronet Gaming',phone:'',email:'jade.ricciardi@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'james',title:'',company:'Codeshop',phone:'',email:'james@codeshop.co.ke',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'James Illingworth',title:'',company:'Gaming Labs',phone:'',email:'j.illingworth@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'James Pickering',title:'',company:'Virgin Bet',phone:'',email:'james.pickering@virginbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'James Simiyu',title:'',company:'Ndovu Soft',phone:'',email:'james@ndovusoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'James Simiyu',title:'',company:'Tekonstruct',phone:'',email:'james.simiyu@tekonstruct.co.ke',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'James Simiyu',title:'',company:'Winlh',phone:'',email:'james@winlh.co.ke',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jamie Zammitt',title:'',company:'BVNK',phone:'',email:'jamie.zammitt@bvnk.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jamieb',title:'',company:'Roo Bet',phone:'',email:'jamieb@roobet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jani',title:'',company:'Skillonnet',phone:'',email:'jani@skillonnet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jani Kontturi',title:'',company:'Kpaxmarketing',phone:'',email:'jani@kpaxmarketing.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jasmin McGillivray',title:'',company:'Betify',phone:'',email:'jasmin@betify.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Javier Pastrana',title:'',company:'Gran Madrid',phone:'',email:'javier.pastrana@granmadrid.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Javier Segura',title:'',company:'Cassiopeia',phone:'',email:'jsegura@cassiopeia.com.ar',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jbustin',title:'',company:'LNW',phone:'',email:'jbustin@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jcgarcia',title:'',company:'Sprint Gaming',phone:'',email:'jcgarcia@sprintgaming.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jean Pierre Bugeja',title:'',company:'Sparkasse Bank Malta',phone:'',email:'jeanpierre.bugeja@sparkasse-bank-malta.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jeffrey Holmes',title:'',company:'Casinotime',phone:'',email:'jeffreyholmes@casinotime.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jelizaveta Brovtseva',title:'',company:'Kaizen Gaming',phone:'',email:'j.brovtseva@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Liza Brovtseva',title:'',company:'QTech Games',phone:'',email:'liza@qtechgames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jennifer Buttigieg',title:'',company:'Relax  Gaming',phone:'',email:'jennifer.buttigieg@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jens Frydenstrand',title:'',company:'Leovegas',phone:'',email:'jens.frydenstrand@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jernej Globocnik',title:'',company:'Bragg',phone:'',email:'jernej.globocnik@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jesse Pas',title:'',company:'3C Solutions',phone:'',email:'j.pas@3csolutions.nl',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jessica Napier',title:'',company:'WH Partners',phone:'',email:'jessica.napier@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'jevgeni.balujev@coolbet.com',title:'',company:'Cool Bet',phone:'',email:'jevgeni.balujev@coolbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jevgenibalujev',title:'',company:'Cool Bet',phone:'',email:'jevgenibalujev@coolbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jevgenija Mondonen',title:'',company:'Casimba Gaming',phone:'',email:'jenni.mondonen@casimbagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'jm@betsea.net',title:'',company:'Betsea',phone:'',email:'jm@betsea.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jo Anna Gariepy',title:'',company:'Loto Quebec',phone:'',email:'jo-anna.gariepy@loto-quebec.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Joanne Johnson',title:'',company:'eCogra',phone:'',email:'joannejohnson@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Joaquin Valente',title:'',company:'Vibra Gaming',phone:'',email:'joaquin.valente@vibragaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jodie Galea',title:'',company:'WH Management',phone:'',email:'jodie.galea@whmanagement.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jodie Galea',title:'',company:'WH Partners',phone:'',email:'jodie.galea@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Joe Adair',title:'',company:'WA Technology',phone:'',email:'joe@watechnology.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'John Atanasio',title:'',company:'Neo',phone:'',email:'john@neo.gg',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'John Gordon',title:'',company:'Incentive Games',phone:'',email:'john.gordon@incentivegames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'John Lee',title:'',company:'Pronet Gaming',phone:'',email:'john.lee@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'John Micallef',title:'',company:'Rng Labs',phone:'',email:'jmicallef@rnglabs.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'John Navarro',title:'',company:'WH Partners',phone:'',email:'john.navarro@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'John Waiganjo',title:'',company:'Tekonstruct',phone:'',email:'jw@tekonstruct.co.ke',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'john.hiltz@opp.ca',title:'',company:'AGCO Interview',phone:'',email:'john.hiltz@opp.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jonathan Heymans',title:'',company:'Keyfin Management',phone:'',email:'jonathan@keyfinmanagement.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jorge Domingos',title:'',company:'Blaze',phone:'',email:'jorge.domingos@blaze.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jorge Ramirez',title:'',company:'Lagersoft',phone:'',email:'jorge.ramirez@bet4.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jorge Ramirez',title:'',company:'Lagersoft',phone:'',email:'jorge.ramirez@lagersoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Joseline Leitoe',title:'',company:'Keyfin Management',phone:'',email:'joseline@keyfinmanagement.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Joselyn Teuma',title:'',company:'WH Partners',phone:'',email:'joselyn.teuma@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Joshua Cruz Nuestro',title:'',company:'iGaming Platform',phone:'',email:'joshua.nuestro@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jriley',title:'',company:'LNW',phone:'',email:'jriley@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Jstephenson',title:'',company:'Boylesports',phone:'',email:'jstephenson@boylesports.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Juan Antonio Bellido Miranda',title:'',company:'Codere',phone:'',email:'juanantonio.bellido@codere.onmicrosoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Juanantonio Bellido',title:'',company:'Codere',phone:'',email:'juanantonio.bellido@codere.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Juanignacio Juanena',title:'',company:'Rei do pitaco',phone:'',email:'juanignacio.juanena@reidopitaco.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Julia Balzan',title:'',company:'WH Partners',phone:'',email:'julia.balzan@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Julia Leite',title:'',company:'Plugnplay',phone:'',email:'julia.leite@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Julien Feyen',title:'',company:'Casinotime',phone:'',email:'julien@casinotime.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Julius Ngigi',title:'',company:'Naibet',phone:'',email:'julius.ngigi@curtisandfletcher.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Juridico',title:'',company:'Apostaganha',phone:'',email:'juridico@apostaganha.bet',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Justin C.',title:'',company:'Spinpals',phone:'',email:'justin@spinpals.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Justin Vermeulen',title:'',company:'eCogra',phone:'',email:'justin@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'K Lekka',title:'',company:'Kaizen Gaming',phone:'',email:'k.lekka@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'K Mishra',title:'',company:'Gaming Labs',phone:'',email:'k.mishra@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'K Shuhai',title:'',company:'Infingame',phone:'',email:'k.shuhai@infingame.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kahne Goldsmith',title:'',company:'Stake',phone:'',email:'k.goldsmith@easygo.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Karl-Oskar Hokkanen',title:'',company:'Nordiclegal',phone:'',email:'karl-oskar@nordiclegal.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Karl-Oskar Hokkanen',title:'',company:'Nordicgambling',phone:'',email:'karl-oskar@nordicgambling.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kassidy Mamboue',title:'',company:'Segevllp',phone:'',email:'k.mamboue@segevllp.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kathy Zammit',title:'',company:'Gaming1',phone:'',email:'kathy.zammit@gaming1.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Katie Fraser',title:'',company:'Relax  Gaming',phone:'',email:'katie.fraser@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Katlego Kekana',title:'',company:'Betway',phone:'',email:'katlego.kekana@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kaylan Shekarchi',title:'',company:'Blaze Soft',phone:'',email:'kaylans@blazesoft.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Keegan Naidoo',title:'',company:'Hollywoodbets',phone:'',email:'knaidoo@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Keiron Downs',title:'',company:'Evoke',phone:'',email:'keiron.downs@evokeplc.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kerija Jancevska',title:'',company:'WA Technology',phone:'',email:'kerija@watechnology.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kim Vella',title:'',company:'Mib',phone:'',email:'kim_vella@mib.com.mt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kimberley Millard',title:'',company:'Relax  Gaming',phone:'',email:'kimberley.millard@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kiril Kirilov',title:'',company:'Pronet Gaming',phone:'',email:'kiril.kirilov@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kirt Calleja',title:'',company:'iGaming Platform',phone:'',email:'kirt.calleja@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kishan Patel',title:'',company:'Entain Group',phone:'',email:'kishan.patel@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kmillar',title:'',company:'LNW',phone:'',email:'kmillar@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kolade Okoko',title:'',company:'Entain Group',phone:'',email:'kolade.okoko2@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kolt Mobiize',title:'',company:'Mobiize',phone:'',email:'kolt@mobiize.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Konov S',title:'',company:'Gamekong',phone:'',email:'konov.s@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Korin',title:'',company:'Pronet Gaming',phone:'',email:'korin@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kris Hills',title:'',company:'Casimba Gaming',phone:'',email:'kris.hills@casimbagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kristijonas Zakas',title:'',company:'Aardvark',phone:'',email:'kristijonas.zakas@aardvark.technology',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kristina Balabanova',title:'',company:'Gamekong',phone:'',email:'balabanova.k@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Krizzap',title:'',company:'Roo Bet',phone:'',email:'krizzap@roobet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kseniya Kuzhym',title:'',company:'Softswiss',phone:'',email:'kseniya.kuzhym@softswiss.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Kun Li',title:'',company:'Rising Digital',phone:'',email:'kun.li@risingdigital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Laberge Marie-Eve',title:'',company:'Loto-Qu?bec',phone:'',email:'marie-eve.laberge@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Laetitia Gregoire',title:'',company:'Alea',phone:'',email:'laetitia.gregoire@alea.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lars Kollind',title:'',company:'Relax  Gaming',phone:'',email:'lars.kollind@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Laura Manukyan',title:'',company:'Betconstruct',phone:'',email:'laura.manukyan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Laura Peretta',title:'',company:'Betsson Group',phone:'',email:'laura.peretta@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Laura Soce',title:'',company:'Mostar',phone:'',email:'laura.soce@mostar.evona.sk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Laurent Lejeune',title:'',company:'Lottoland',phone:'',email:'laurent.lejeune@lottoland.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lavina Karlsson',title:'',company:'Casimba Gaming',phone:'',email:'lavina.karlsson@casimbagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Leachan',title:'',company:'Acewin Gaming',phone:'',email:'leachan@acewingaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Leann Bruno',title:'',company:'Gaming Labs',phone:'',email:'l.bruno@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lee Hills',title:'',company:'Solutionshub',phone:'',email:'lee@solutionshub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lethukuthula Sithole',title:'',company:'Hollywoodbets',phone:'',email:'lethukuthulas@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Levy Wafula',title:'',company:'Tekonstruct',phone:'',email:'levy.wafula@tekonstruct.co.ke',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lgeorgoulopoulou',title:'',company:'Novibet',phone:'',email:'lgeorgoulopoulou@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Liam Isaac',title:'',company:'Tsogosun Digital',phone:'',email:'liam.isaac@tsogosundigital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Liam Rowland',title:'',company:'Entain Group',phone:'',email:'liam.rowland2@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Liam Singh',title:'',company:'Betway',phone:'',email:'liam.singh@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lina Henriquez',title:'',company:'Casinotime',phone:'',email:'linahenriquez@casinotime.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lina Stoeva',title:'',company:'EGT  Digital',phone:'',email:'lina.stoeva@egt-digital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lisa Fino',title:'',company:'WH Partners',phone:'',email:'lisa.fino@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Liz Cohen',title:'',company:'Groovetech',phone:'',email:'liz@groovetech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lizbeth Nallely Palacio Puerta',title:'',company:'Virtual Soft',phone:'',email:'lizbeth.palacio@virtualsoft.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lizzie Huang',title:'',company:'Lottomart',phone:'',email:'lizzie.huang@lottomart.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Loic Boisselier Ext',title:'',company:'Koralplay',phone:'',email:'loic.boisselier.ext@koralplay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lora Stefanova',title:'',company:'EGT  Digital',phone:'',email:'lora.stefanova@egt-digital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Louise Burt',title:'',company:'Flutterstudios',phone:'',email:'louise_burt@flutterstudios.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lucas Falco',title:'',company:'Goldenpalace',phone:'',email:'lucas.falco@goldenpalace.be',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lucas Salas',title:'',company:'Share Solutions',phone:'',email:'isalas@sharesolutions.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lucien Pillay',title:'',company:'Tsogosun Digital',phone:'',email:'lucien.pillay@tsogosundigital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Luis Del Val Jimenez',title:'',company:'Codere',phone:'',email:'luis.delval@codere.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Luisa Munoz',title:'',company:'Stake',phone:'',email:'l.munoz@easygo.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Luiza Bica',title:'',company:'Viva Games',phone:'',email:'luiza.bica@vivagames.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Luke Malt',title:'',company:'Betsson Group',phone:'',email:'luke.malt@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Lusine Khudaverdyan',title:'',company:'Gr8',phone:'',email:'lusine.khudaverdyan@gr8.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'M Nyanteh',title:'',company:'Superbet',phone:'',email:'m.nyanteh@happening.xyz',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'M Sim',title:'',company:'Gaming Labs',phone:'',email:'m.sim@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mahjabeen Parvez',title:'',company:'Gaming Associates',phone:'',email:'mahjabeen.parvez@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'mail-dl-bonus-infin',title:'',company:'Infingame',phone:'',email:'bonus@infingame.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Maja Ogrinec',title:'',company:'Bragg',phone:'',email:'maja.ogrinec@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Maja Rantusa',title:'',company:'Kaizen Gaming',phone:'',email:'m.rantusa@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Major Charles',title:'',company:'Loto-Qu?bec',phone:'',email:'charles.major@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Malcolm Agius',title:'',company:'Super Bet',phone:'',email:'malcolm.agius@superbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Manny De Abreu',title:'',company:'eCogra',phone:'',email:'manny@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Manuel Molina',title:'',company:'iGaming Platform',phone:'',email:'manuel.molina@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marc Krog',title:'',company:'Betway',phone:'',email:'marc.krog@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marco Pierotti',title:'',company:'Euro Bet',phone:'',email:'marco.pierotti@eurobet.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marco Strazzulla',title:'',company:'Betsson Group',phone:'',email:'marco.strazzulla@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marco Varchetta',title:'',company:'GLI Secure',phone:'',email:'m.varchetta@glisecure.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marcus Oliveira | PlugNPlay',title:'',company:'Plugnplay',phone:'',email:'marcus.oliveira@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Maria LIQUITO',title:'',company:'Koralplay',phone:'',email:'maria.liquito@koralplay.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Maria Marciales',title:'',company:'Alea',phone:'',email:'maria.marciales@alea.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mariam',title:'',company:'Groovetech',phone:'',email:'mariam@technfusion.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mariana Gonzalez',title:'',company:'Lagersoft',phone:'',email:'mariana.gonzalez@lagersoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mariana Soares',title:'',company:'Solverde',phone:'',email:'marianasoares@solverde.pt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mariano',title:'',company:'Wanejo Technology',phone:'',email:'mariano@wanejotechnology.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marina Fyodorova',title:'',company:'Softswiss',phone:'',email:'marina.fyodorova@softswiss.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marina Kaplun',title:'',company:'GLI Secure',phone:'',email:'m.kaplun@glisecure.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marina Wong',title:'',company:'Gaming Labs',phone:'',email:'m.wong@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mariska Walkenshaw',title:'',company:'Betway',phone:'',email:'mariskaw@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marit Ellul',title:'',company:'Betsson Group',phone:'',email:'marit.ellul@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marjana',title:'',company:'Brazino',phone:'',email:'marjana@absolutegames.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mark Halstead',title:'',company:'Reevotech',phone:'',email:'mark.halstead@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mark Robertson',title:'',company:'Bettomax',phone:'',email:'mark@bettomax.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mark Scicluna',title:'',company:'Mib',phone:'',email:'mark_scicluna@mib.com.mt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Marko Debeljak',title:'',company:'Timelesstech',phone:'',email:'marko@timelesstech.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Martin Ivanov',title:'',company:'Gamekong',phone:'',email:'ivanov.mar@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Massimo Nura',title:'',company:'Snai tech',phone:'',email:'massimo.nura@snaitech.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matei Secaci',title:'',company:'Viva Games',phone:'',email:'matei.secaci@vivagames.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matoula Kritikou',title:'',company:'Kaizen Gaming',phone:'',email:'m.kritikou@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matthew Jones',title:'',company:'Solutionshub',phone:'',email:'matthew.jones@solutionshub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matthew Martinelli',title:'',company:'Leovegas',phone:'',email:'matthew.martinelli@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matthew Piscopo',title:'',company:'Sportingtech',phone:'',email:'matthew.piscopo@sportingtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matthew W',title:'',company:'Sporting Bet',phone:'',email:'matthew@s-b.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matthew Vink',title:'',company:'Entain Group',phone:'',email:'matthew.vink2@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Matthew Williamson',title:'',company:'Relax  Gaming',phone:'',email:'matthew.williamson@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mattia Battaini',title:'',company:'Snai tech',phone:'',email:'mattia.battaini@snaitech.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Maximilian Oehninger',title:'',company:'Bankfrick',phone:'',email:'maximilian.oehninger@bankfrick.co.uk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Maximilliana Izzo',title:'',company:'Betsson Group',phone:'',email:'maximilliana.izzo@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Maximos Vourtsis',title:'',company:'Alpha Omega',phone:'',email:'mvourtsis@alpha-omega.ai',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Megan Hancheck',title:'',company:'Gaming Labs',phone:'',email:'m.hancheck@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Megan Sponneck',title:'',company:'Casimba Gaming',phone:'',email:'megan.sponneck@casimbagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Megan Sponneck',title:'',company:'Markortech',phone:'',email:'m.sponneck@markortech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Melanie Gallacher',title:'',company:'WH Management',phone:'',email:'melanie.gallacher@whmanagement.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Melusi Dladla',title:'',company:'eCogra',phone:'',email:'melusi@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mert',title:'',company:'Tadagamig',phone:'',email:'mert@tadagamig.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mery Khachatryan',title:'',company:'Betfounders',phone:'',email:'mery.khachatryan@betfounders.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'MF Estudio - Migratorio',title:'',company:'Mfestudio',phone:'',email:'migratorio@mfestudio.com.ar',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Michael Reilly',title:'',company:'Lottoland',phone:'',email:'michael.reilly@lottoland.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Michail Christodoulopoulos',title:'',company:'Casimba Gaming',phone:'',email:'michail.christodoulopoulos@casimbagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Michelle Eg',title:'',company:'Nordiclegal',phone:'',email:'michelle@nordiclegal.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Midhat Sana',title:'',company:'Gaming Associates',phone:'',email:'midhat.sana@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Miguel Attard',title:'',company:'Sparkasse Bank Malta',phone:'',email:'miguel.attard@sparkasse-bank-malta.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Miguel Luis',title:'',company:'Lebull',phone:'',email:'miguel.luis@lebull.pt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mikita Mialeshka',title:'',company:'Softswiss',phone:'',email:'mikita.mialeshka@softswiss.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Milica Jovanovic',title:'',company:'Atlaslive',phone:'',email:'milica.jovanovic@atlaslive.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Milla Ludovico de Oliveira Teixeira',title:'',company:'Cactus',phone:'',email:'milla.teixeira@octus.pt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mmavrogianni',title:'',company:'Izi Group',phone:'',email:'mmavrogianni@izigroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Moattar Ali Ahmed',title:'',company:'Gaming Associates',phone:'',email:'moattar.ali@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Moona Siddiqui',title:'',company:'Gaming Associates',phone:'',email:'moona.siddiqui@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Muhammad Usama Iqbal',title:'',company:'Gaming Associates',phone:'',email:'usama.iqbal@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Munene Njogu',title:'',company:'Naibet',phone:'',email:'munene.njogu@naibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Munene Njogu',title:'',company:'Naibet',phone:'',email:'munene.njogu@curtisandfletcher.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mykola Kondratiev',title:'',company:'Infingame',phone:'',email:'m.kondratiev@infingame.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Mykola Vernydub',title:'',company:'Atlaslive',phone:'',email:'mykola.vernydub@atlaslive.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'N Chang',title:'',company:'Gaming Labs',phone:'',email:'n.chang@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'N Christakis',title:'',company:'Opap',phone:'',email:'n.christakis@opap.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'N Maraccio',title:'',company:'Lottomatica',phone:'',email:'n.marcaccio@lottomatica.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nadeem Mustafa',title:'',company:'Gaming Associates',phone:'',email:'nadeem.mustafa@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nadim Maalouf',title:'',company:'Triple A',phone:'',email:'nadim.maalouf@triple-a.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Najib',title:'',company:'Netbet UG',phone:'',email:'najib@netbetug.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Natalia',title:'',company:'Blaze',phone:'',email:'natalia@blaze.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Natalie Krivosheeva',title:'',company:'Kaizen Gaming',phone:'',email:'n.krivosheeva@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Natallia',title:'',company:'Pronet Gaming',phone:'',email:'natallia@pronetgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nevena Traykova',title:'',company:'EGT  Digital',phone:'',email:'nevena.traykova@egt-digital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ngoc Nguyen',title:'',company:'Rng Labs',phone:'',email:'ngoc@rnglabs.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ngoc Nguyen',title:'',company:'Livescore',phone:'',email:'ngoc.nguyen@livescore.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Niaje',title:'',company:'Odibets',phone:'',email:'niaje@odibets.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nick',title:'',company:'Tapking',phone:'',email:'nick@tapking.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nick  Bowden',title:'',company:'eGaminghub',phone:'',email:'nick.bowden@egaminghub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nick Baker',title:'',company:'Kingmakers',phone:'',email:'nick.baker@kingmakers.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nick Bowden',title:'',company:'Solutionshub',phone:'',email:'nick.bowden@solutionshub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nicola Cainero',title:'',company:'Timelesstech',phone:'',email:'nicola@timelesstech.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nicolas Dobereiner',title:'',company:'iGaming Platform',phone:'',email:'nicolas.dobereiner@igamingplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nicos Constandinou',title:'',company:'Usoft Gaming',phone:'',email:'nicos@usoftgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Niko Uitto',title:'',company:'Immense Group (Ontario Agent)',phone:'',email:'niko.uitto@immensegroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nikolas Giannikopoulos',title:'',company:'Kaizen Gaming',phone:'',email:'n.giannikopoulos@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nikolay Tokadjiev',title:'',company:'Gamekong',phone:'',email:'tokadjiev.n@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nikos Bachas',title:'',company:'Novibet',phone:'',email:'nbachas@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nina Thomas',title:'',company:'Gaming Labs',phone:'',email:'n.thomas@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'nina@tadagamig.com',title:'',company:'Tadagamig',phone:'',email:'nina@tadagamig.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nino Tsikhiseli',title:'',company:'Broadway Platform',phone:'',email:'ntsikhiseli@broadwayplatform.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'NOC',title:'',company:'Reevotech',phone:'',email:'noc@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nomfundo Khwela',title:'',company:'Bet Software',phone:'',email:'nkhwela@betsoftware.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nona Kaynakchieva',title:'',company:'EGT  Digital',phone:'',email:'nona.kaynakchieva@egt-digital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Noreen Ramirez',title:'',company:'Rng Labs',phone:'',email:'nramirez@rnglabs.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Norman Gabriel Walsh Gomez',title:'',company:'Codere',phone:'',email:'normang.walsh@codere.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Norman Gabriel Walsh Gomez',title:'',company:'Codere',phone:'',email:'normang.walsh@codere.onmicrosoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ntaouliari N',title:'',company:'Gamekong',phone:'',email:'ntaouliari.n@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nyu',title:'',company:'Betty',phone:'',email:'nyu@betty.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Nzarnadze',title:'',company:'Up Gaming',phone:'',email:'nzarnadze@upgaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Obdulio Bacarese',title:'',company:'Entain Group',phone:'',email:'obdulio.bacarese@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Oliver Gibbons',title:'',company:'Plannatech',phone:'',email:'oliver.gibbons@plannatech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ombeline Chaboureau',title:'',company:'Goldenpalace',phone:'',email:'ombeline.chaboureau@goldenpalace.be',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'P Otto',title:'',company:'Gaming Labs',phone:'',email:'p.otto@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Panagiota Dimopoulou',title:'',company:'Kaizen Gaming',phone:'',email:'p.dimopoulou@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Panos Giannissis',title:'',company:'Giannissis (Greek Agent)',phone:'',email:'panos.giannissis@giannissis.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Paola Gonzalez',title:'',company:'Lagersoft',phone:'',email:'paola.gonzalez@lagersoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pascal Tootell',title:'',company:'Vixio',phone:'',email:'ptootell@vixio.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Patricia Soria Ibanez',title:'',company:'Gaming Labs',phone:'',email:'p.soriaibanez@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Patricia Soriaibanez',title:'',company:'Bulletproof SA Licensor',phone:'',email:'patricia.soriaibanez@bulletproofsi.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Patrick Bruce',title:'',company:'Flutterstudios',phone:'',email:'patrick_bruce@flutterstudios.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Patrick Roberts',title:'',company:'In2Solutions Ltd',phone:'',email:'patrick@in2solutionsltd.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Paul Malt',title:'',company:'Betsson Group',phone:'',email:'paul.malt@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Paulo',title:'',company:'Qtech Games',phone:'',email:'paulo@qtechgames.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pavlo St',title:'',company:'Fairspin',phone:'',email:'pavlo.st@fairspin.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pavlos Gkoulelis',title:'',company:'EC Partners',phone:'',email:'pavlos.gkoulelis@ecpartners.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pedro Costa',title:'',company:'Bet MGM',phone:'',email:'pedro.costa@betmgm.com.br',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pernilla Strand',title:'',company:'Kpaxmarketing',phone:'',email:'pernilla@kpaxmarketing.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Petar Rakic',title:'',company:'Sportingtech',phone:'',email:'petar.rakic@sportingtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Petar Trifonov',title:'',company:'Gamekong',phone:'',email:'trifonov.p@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Peter Nolte',title:'',company:'Salsa Technology',phone:'',email:'peter.nolte@salsatechnology.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Petrus Partene',title:'',company:'Whsimion Partners',phone:'',email:'petrus.partene@whsimionpartners.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Philip Forster',title:'',company:'Flutter',phone:'',email:'philip.forster@flutter.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pierina Vitanza',title:'',company:'Goldenpalace',phone:'',email:'pierina.vitanza@goldenpalace.be',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pietro Cimino',title:'',company:'Betsson Group',phone:'',email:'pietro.cimino@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Poirier Chantal',title:'',company:'Loto-Qu?bec',phone:'',email:'chantal.poirier@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Pol Martinez',title:'',company:'Alea',phone:'',email:'pol.martinez@alea.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Polina Sabanova',title:'',company:'Most Bet',phone:'',email:'p.sabanova@double.global',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Prenisha Moodley',title:'',company:'Gaming Labs',phone:'',email:'p.moodley@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Priit Raamat',title:'',company:'Hub88',phone:'',email:'priit.raamat@yolo.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Prishenp',title:'',company:'Bet Software',phone:'',email:'prishenp@betsoftware.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Qasim Raza',title:'',company:'Gaming Associates',phone:'',email:'qasim.raza@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rachel Grixti',title:'',company:'WH Partners',phone:'',email:'rachel.grixti@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rachel T',title:'',company:'Groovetech',phone:'',email:'rachel.t@groovetech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Radoslav Vladimirov',title:'',company:'EGT  Digital',phone:'',email:'radoslav.vladimirov@egt-digital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rafaella Frantzi',title:'',company:'Reevotech',phone:'',email:'rafaella.frantzi@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rainier Udarbe',title:'',company:'Reevotech',phone:'',email:'rainier.udarbe@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Raluca Varzaru',title:'',company:'Super Bet',phone:'',email:'raluca.varzaru@superbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Raymond Tanti',title:'',company:'Gamekong',phone:'',email:'tanti.r@brainrocket.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rebecca Montanaro',title:'',company:'Gaming Labs',phone:'',email:'r.montanaro@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Reconciliation EveryMatrix',title:'',company:'Everymatrix',phone:'',email:'reconciliation@everymatrix.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Renato Bazzarini',title:'',company:'Goldenpalace',phone:'',email:'renato.bazzarini@goldenpalace.be',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Renato Dzidic',title:'',company:'Mostar',phone:'',email:'renato.dzidic@mostar.evona.sk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Reuben',title:'',company:'Jambo Bet',phone:'',email:'reuben@jambobet.co.ke',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rfieldsend',title:'',company:'LNW',phone:'',email:'rfieldsend@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ricardo Arias',title:'',company:'Bet MGM',phone:'',email:'ricardo.arias@betmgm.com.br',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ricardo Axel',title:'',company:'Rei do pitaco',phone:'',email:'ricardo.axel@reidopitaco.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ricarl Singh',title:'',company:'Hollywoodbets',phone:'',email:'ricarls@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Richard Ann-Julie',title:'',company:'Loto Quebec',phone:'',email:'ann-julie.richard@loto-quebec.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Richard Rydell',title:'',company:'Solidicon',phone:'',email:'richard.rydell@solidicon.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Richard Varty',title:'',company:'Sporty Bet',phone:'',email:'richard.varty@sporty.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Riikka Seppanen',title:'',company:'Veikkaus',phone:'',email:'riikka.seppanen@veikkaus.fi',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rikka Seppanen',title:'',company:'Veikkaus',phone:'',email:'rikka.seppanen@veikkaus.fi',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Riley Maistry',title:'',company:'Kingmakers',phone:'',email:'riley.maistry@kingmakers.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rita Claassen',title:'',company:'Relax  Gaming',phone:'',email:'rita.claassen@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rob Strahlendorf',title:'',company:'Gaming Labs',phone:'',email:'r.strahlendorf@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Robert Nevill',title:'',company:'Sportingtech',phone:'',email:'robert.nevill@sportingtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Robert Zammit',title:'',company:'WH Partners',phone:'',email:'robert.zammit@whpartners.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Roberto Formosa',title:'',company:'Machete',phone:'',email:'roberto@machete.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Robertson Stephan',title:'',company:'Loto-Qu?bec',phone:'',email:'stephan.robertson@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rocio Maria Martinez',title:'',company:'Casimba Gaming',phone:'',email:'maria.martinez@casimbagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rok Hribar',title:'',company:'Beefee',phone:'',email:'rok.hribar@beefee.co.uk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rossana Gauci Briffa',title:'',company:'WH Management',phone:'',email:'rossana.briffa@whmanagement.eu',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ruan',title:'',company:'Betify',phone:'',email:'ruan@betify.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ruben Redman',title:'',company:'Gaming Labs',phone:'',email:'r.redman@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Rui Fortes da Gama',title:'',company:'Solverde',phone:'',email:'ruigama@solverde.pt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ruveyda',title:'',company:'Pronet',phone:'',email:'ruveyda@sportdevops.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ruzanna Yolchyan',title:'',company:'Betconstruct',phone:'',email:'ruzanna.yolchyan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ryan Horowitz',title:'',company:'Betway',phone:'',email:'ryan.horowitz@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ryno  Du Plessis',title:'',company:'WSB',phone:'',email:'ryno@wsb.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'S Almasri',title:'',company:'Kaizen Gaming',phone:'',email:'s.almasri@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'S Rodriguez',title:'',company:'Betclic Group',phone:'',email:'s.rodriguez@betclicgroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Saba Arakhamia',title:'',company:'Spribe',phone:'',email:'sarakhamia@spribe.co',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sales Mobiize',title:'',company:'Mobiize',phone:'',email:'sales@mobiize.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sam Carss',title:'',company:'Sportingtech',phone:'',email:'sam.carss@sportingtech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sameera Sheraz',title:'',company:'Gaming Associates',phone:'',email:'sameera.sheraz@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Santiago Rodriguez',title:'',company:'Stake',phone:'',email:'s.rodriguez@easygo.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sara Turk',title:'',company:'Blueocean Gaming',phone:'',email:'sara.turk@blueoceangaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sarah Henderson',title:'',company:'Ballys International',phone:'',email:'sarah.henderson@ballysinternational.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sarah Micallef',title:'',company:'Betsson Group',phone:'',email:'sarah.micallef@betssongroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sashen Subramony',title:'',company:'Hollywoodbets',phone:'',email:'sashens@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Savanna Jon',title:'',company:'Casinotime',phone:'',email:'savannajon@casinotime.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sean Hulse',title:'',company:'Plannatech',phone:'',email:'sean.hulse@plannatech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Seanm',title:'',company:'Betway',phone:'',email:'seanm@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sebastian Kufert',title:'',company:'Vibra Gaming',phone:'',email:'sebastian.kufert@vibragaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Seda Baburyan',title:'',company:'Betconstruct',phone:'',email:'seda.baburyan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sedrakyan Areg',title:'',company:'Betconstruct',phone:'',email:'sedrakyan.areg@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Selena Ajkunic',title:'',company:'Bragg',phone:'',email:'selena.ajkunic@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Senthil Maistry',title:'',company:'Sun Bet',phone:'',email:'senthil.maistry@sunbet.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Serge Sacre',title:'',company:'Goldenpalace',phone:'',email:'serge.sacre@goldenpalace.be',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sergio Ruperez',title:'',company:'Gran Madrid',phone:'',email:'sergio.ruperez@granmadrid.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sgialamas',title:'',company:'Novibet',phone:'',email:'sgialamas@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sgiotis',title:'',company:'Novibet',phone:'',email:'sgiotis@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Shafaq Tazeen',title:'',company:'Gaming Associates',phone:'',email:'shafaq.tazeen@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Shanise Naidoo',title:'',company:'Hollywoodbets',phone:'',email:'shanisen@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Shannon Zahra Chetcuti',title:'',company:'Sparkasse Bank Malta',phone:'',email:'shannon.zahrachetcuti@sparkasse-bank-malta.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Shivan Patel',title:'',company:'Bragg',phone:'',email:'shivan.patel@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Shivani Reddy',title:'',company:'Bet Software',phone:'',email:'shivanir@betsoftware.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Silvana Curteanu-Tihon',title:'',company:'Whsimion Partners',phone:'',email:'silvana.curteanu@whsimionpartners.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Silvio Araujo',title:'',company:'Plugnplay',phone:'',email:'silvio.araujo@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Silviya Milenova',title:'',company:'EGT  Digital',phone:'',email:'silviya.milenova@egt-digital.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Simon Cleaver',title:'',company:'Flutterstudios',phone:'',email:'simon_cleaver@flutterstudios.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sinead Benson',title:'',company:'Relax  Gaming',phone:'',email:'sinead.benson@relax-gaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sizakele Mfuphi',title:'',company:'Hollywoodbets',phone:'',email:'sizakelem@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sleach',title:'',company:'Boylesports',phone:'',email:'sleach@boylesports.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sneh Mkhize',title:'',company:'Sun Bet',phone:'',email:'sneh.mkhize@sunbet.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Snjeza',title:'',company:'Brazino',phone:'',email:'snjeska@synthevo.pro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sotiris Sparis',title:'',company:'Notix',phone:'',email:'s.sparis@notix.games',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sphamandla Langa',title:'',company:'eCogra',phone:'',email:'sphamandla@ecogra.org',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sri Balini',title:'',company:'Gaming Associates',phone:'',email:'sri.balini@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sseguna',title:'',company:'LNW',phone:'',email:'sseguna@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Sstylianaki',title:'',company:'Novibet',phone:'',email:'sstylianaki@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stanley',title:'',company:'Gaming Soft',phone:'',email:'stanley@gamingsoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stef',title:'',company:'Star Casino',phone:'',email:'stef@starcasino.be',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stefano Giancotti - NetWin.it',title:'',company:'Netwin',phone:'',email:'stefano.giancotti@netwin.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stelios Tourtoulas',title:'',company:'Novibet',phone:'',email:'stourtoulas@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stella Spyropoulou',title:'',company:'EC Partners',phone:'',email:'stella.spyropoulou@ecpartners.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stephane Martel',title:'',company:'Loto-Qu?bec',phone:'',email:'stephane.martel@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stephanie Consiglio',title:'',company:'Entain Group',phone:'',email:'stephanie.consiglio@entaingroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stephenc',title:'',company:'Roo Bet',phone:'',email:'stephenc@roobet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Steven Crowe',title:'',company:'Silverspin',phone:'',email:'steven.crowe@silverspin.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Steven Li',title:'',company:'In2Solutions Ltd',phone:'',email:'steven.li@in2solutionsltd.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Steven Welsh',title:'',company:'eGaminghub',phone:'',email:'steven.welsh@egaminghub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Steven Welsh',title:'',company:'Solutionshub',phone:'',email:'steven.welsh@solutionshub.im',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Strategic Partnerships Novibet',title:'',company:'Novibet',phone:'',email:'spcasino@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Stuart Eagle',title:'',company:'Gamekong',phone:'',email:'eagle.s@brainrocket.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Susanne Olufsen',title:'',company:'Solidicon',phone:'',email:'susanne.olufsen@solidicon.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Svilen',title:'',company:'Kpaxmarketing',phone:'',email:'svilen@kpaxmarketing.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Syed Ali Asad',title:'',company:'Gaming Associates',phone:'',email:'ali.asad@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Syed Asif Ali Rizvi',title:'',company:'Gaming Associates',phone:'',email:'asif.ali@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Syed Asim Hassan',title:'',company:'Gaming Associates',phone:'',email:'asim.hassan@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Syed Mohammad Abbas Naqvi',title:'',company:'Gaming Associates',phone:'',email:'abbas.naqvi@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'T Tsintzoura',title:'',company:'Kaizen Gaming',phone:'',email:'t.tsintzoura@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'T Kourogiorgas',title:'',company:'Stoiximan',phone:'',email:'t.kourogiorgas@stoiximan.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Talal Tariq',title:'',company:'Gaming Associates',phone:'',email:'talal.tariq@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tamara Fokina',title:'',company:'Gr8',phone:'',email:'tamara.fokina@gr8.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tamara Wibberley',title:'',company:'Australian Gaming Expo',phone:'',email:'tamara@gamingta.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tania Javed',title:'',company:'Gaming Associates',phone:'',email:'tania.javed@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tanielle',title:'',company:'Wanejo Technology',phone:'',email:'tanielle@wanejobets.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tanya Reddy',title:'',company:'Gaming Labs',phone:'',email:'t.reddy@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tasos Vassios',title:'',company:'Kivon',phone:'',email:'tvassios@kivon.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tatiana Glekova',title:'',company:'Softgamings',phone:'',email:'tatiana.glekova@softgamings.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tatiana Stelmakh',title:'',company:'Softgamings',phone:'',email:'tatiana.stelmakh@softgamings.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tbarrenechea',title:'',company:'LNW',phone:'',email:'tbarrenechea@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tech | PlugNPlay',title:'',company:'Plugnplay',phone:'',email:'tech@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Technical Compliance',title:'',company:'Paddy Power Betfair',phone:'',email:'technical.compliance@paddypowerbetfair.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tedd Ulit',title:'',company:'Reevotech',phone:'',email:'tedd.ulit@reevotech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tero',title:'',company:'Cool Bet',phone:'',email:'tero@coolbet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tetyana P',title:'',company:'Kanggiten',phone:'',email:'tetyana.p@kanggiten.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tevin Govender',title:'',company:'Hollywoodbets',phone:'',email:'teving@hollywoodbets.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Thalissa Cristina Sales',title:'',company:'Cactus Gaming',phone:'',email:'thalissa.sales@cactusgaming.net',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Thekla Klitoraki',title:'',company:'Kaizen Gaming',phone:'',email:'t.klitoraki@kaizengaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Theodor Simion',title:'',company:'Whsimion Partners',phone:'',email:'theodor.simion@whsimionpartners.ro',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Theodora Tsintzoura',title:'',company:'Novibet',phone:'',email:'thtsintzoura@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Theofanis Kachrimanidis',title:'',company:'Leovegas',phone:'',email:'theofanis.kachrimanidis@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Thomaz',title:'',company:'Cometa Gaming',phone:'',email:'thomaz@cometagaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tiago Pereira',title:'',company:'Lebull',phone:'',email:'tiago.pereira@lebull.pt',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tiffany Rosenberg',title:'',company:'Leovegas',phone:'',email:'tiffany.rosenberg@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tijana Perunicic',title:'',company:'Bragg',phone:'',email:'tijana.perunicic@bragg.group',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Timo Thronicke',title:'',company:'Veikkaus',phone:'',email:'timo.thronicke@veikkaus.fi',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tokadjiev N',title:'',company:'Gamekong',phone:'',email:'tokadjiev.n@brainrocket.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tom',title:'',company:'Pawatech',phone:'',email:'tom@pawatech.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tom',title:'',company:'Tom3',phone:'',email:'tom@tom3.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tomas',title:'',company:'Garciabotta (Peru Agent)',phone:'',email:'tomas@garciabotta.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tomaz Furtad',title:'',company:'Plugnplay',phone:'',email:'tomaz.furtado@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tremblay Jonathan',title:'',company:'Loto-Qu?bec',phone:'',email:'jonathan.tremblay@casino.qc.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tsvetan',title:'',company:'Wiztech Group',phone:'',email:'tsvetan@wiztechgroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Tyler Gentle',title:'',company:'Sun Bet',phone:'',email:'tyler.gentle@sunbet.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ulyana Piatrovich',title:'',company:'Softswiss',phone:'',email:'ulyana.piatrovich@softswiss.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Urooj Riaz',title:'',company:'Gaming Associates',phone:'',email:'urooj.riaz@gamingassociates.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Uvanie Govender',title:'',company:'Super Group',phone:'',email:'uvanie.govender@supergroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Uvanieg',title:'',company:'Betway',phone:'',email:'uvanieg@osiristrading.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Valentyn Kyrylenko',title:'',company:'Inplay Soft',phone:'',email:'valentyn.kyrylenko@inplaysoft.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Valeria Dimarco',title:'',company:'Euro Bet',phone:'',email:'valeria.dimarco@eurobet.it',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Valeria Russo',title:'',company:'Leovegas',phone:'',email:'valeria.russo@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Vandit Yadav',title:'',company:'GLI Secure',phone:'',email:'v.yadav@glisecure.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Varshan Naidoo',title:'',company:'Gaming Labs',phone:'',email:'v.naidoo@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Vdarivakis',title:'',company:'Novibet',phone:'',email:'vdarivakis@novibet.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Veronika',title:'',company:'Parimatch',phone:'',email:'veronika.ayv@pm.global',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Veronika Ayvazyan',title:'',company:'Betconstruct',phone:'',email:'veronika.ayvazyan@softconstruct.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Verushka',title:'',company:'Game on Studios bet',phone:'',email:'verushka@gameonstudios.bet',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Victor Pace',title:'',company:'Sparkasse Bank Malta',phone:'',email:'victor.pace@sparkasse-bank-malta.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Victoria Ombogo',title:'',company:'Tekonstruct',phone:'',email:'victoria@tekonstruct.co.ke',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'viktor Cherkas',title:'',company:'Kanggiten',phone:'',email:'viktor.ch@kanggiten.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Viktoria Petrova',title:'',company:'Leovegas',phone:'',email:'viktoria.petrova@leovegas.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Vita Skribane',title:'',company:'Softgamings',phone:'',email:'vita.skribane@softgamings.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Vladlena Mumerko',title:'',company:'Atlaslive',phone:'',email:'vladlena.mumerko@atlaslive.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Vitne Le',title:'',company:'LNW',phone:'',email:'vle2@LNW.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Vtancredi',title:'',company:'Tukopro',phone:'',email:'vtancredi@tukopro.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'William Ainscoe',title:'',company:'Gaming Labs',phone:'',email:'w.ainscoe@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Willie Delport',title:'',company:'Betify',phone:'',email:'willie@betify.co.za',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Willinny Lima',title:'',company:'Plugnplay',phone:'',email:'willinny.lima@plugnplay.io',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Wuajzen',title:'',company:'In2Solutions Ltd',phone:'',email:'wuajzen@in2solutionsltd.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Xristina Katsika',title:'',company:'Kivon',phone:'',email:'xkatsika@kivon.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yan Stepanov',title:'',company:'Atlaslive',phone:'',email:'yan.stepanov@atlaslive.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yannick Borg',title:'',company:'Hero Gaming',phone:'',email:'yannick.borg@herogaming.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yash Dave',title:'',company:'Blaze Soft',phone:'',email:'yashd@blazesoft.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Ycampos',title:'',company:'Boylesports',phone:'',email:'ycampos@boylesports.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yevheniia Shmelkova',title:'',company:'Atlaslive',phone:'',email:'yevheniia.shmelkova@atlaslive.tech',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'YIannis Economakis',title:'',company:'EC Partners',phone:'',email:'yiannis.economakis@ecpartners.gr',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yogesh Kumar Singh',title:'',company:'Gaming Labs',phone:'',email:'y.singh@gaminglabs.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yoni Sidi',title:'',company:'Wiztech Group',phone:'',email:'yoni@wiztechgroup.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yordan Ivanov',title:'',company:'Gamekong',phone:'',email:'yordan.i@sofiastars.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yuliia Kundel',title:'',company:'Slotegrator',phone:'',email:'yu.kundel@slotegrator.com',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'Yuliya Ivanisova',title:'',company:'Blaze Soft',phone:'',email:'yuliya@blazesoft.ca',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
  {id:uid(),name:'zeljko juranovic',title:'',company:'Mostar',phone:'',email:'zeljko.juranovic@mostar.evona.sk',linkedin:'',dinnerPref:'',giftPref:'',notes:''},
];

// Merged contacts seed: master list + Chu CSV contacts
const ALL_CONTACTS_SEED = [...CONTACTS_SEED, ...CHU_CSV_CONTACTS];

// ─── ICE BARCELONA 2026 ───────────────────────────────────────────────────────
const ICE_MEETINGS = [
  mkm("2026-01-19","09:30","Ivan Belic","Pronet Gaming","Aggregator","Chu","","Our Stand","",{"Pineapple":2},""),
  mkm("2026-01-19","10:00","Stacey","Toto Casino","Operator","Nina","Silvio","Our Stand","",{},""),
  mkm("2026-01-19","10:30","Giulia","Light & Wonder","Aggregator","Nina, Chu","Aisha","Their Stand","",{"Pineapple":1},"Live"),
  mkm("2026-01-19","11:00","Fernanda","EstrelaBet","Operator","Heitor","Steven","Our Stand","",{},""),
  mkm("2026-01-19","11:30","Kathy, Essi, Simone","Reevo (Circus)","Operator","","Aisha","Their Stand","",{"Pineapple":3},""),
  mkm("2026-01-19","12:00","Matteo","BF Games","Aggregator","Nina","Silvio","Our Stand","",{"Pineapple":2},""),
  mkm("2026-01-19","12:30","Tomas","Argentina (Law Firm)","Law Firm","Heitor, Chu","","Neutral","",{},""),
  mkm("2026-01-19","13:00","Pietro","Betsson","Operator","Nina","Silvio","Their Stand","",{"Kavalan Whiskey":1,"Pineapple":2},""),
  mkm("2026-01-19","14:00","Fernando","Betvip","Operator","Heitor","","Our Stand","",{},"Live"),
  mkm("2026-01-19","14:30","Eefje","Blitz","Operator","","Aisha","Our Stand","",{"Pineapple":2},"Live"),
  mkm("2026-01-19","15:00","Lyudmila","GR8_KZT","Operator","","Allen","Our Stand","",{"Pineapple":1},"Live"),
  mkm("2026-01-19","15:30","Hugo","IGT","Aggregator","Nina","","Their Stand","",{"Pineapple":1},"Live"),
  mkm("2026-01-19","16:00","Petar, Matthew","Sportingtech","Platform Provider","Heitor","Steven","Their Stand","",{},"Live"),
  mkm("2026-01-19","16:30","Dato","Upgaming","Operator","Bryam","Aisha","Our Stand","",{"Kavalan Whiskey":1,"Pineapple":2},""),
  mkm("2026-01-19","17:00","Nataliia","Gamingtech","Aggregator","Bryam","Allen, Mert","Our Stand","",{"Kavalan Whiskey":1,"Pineapple":2},""),
  mkm("2026-01-19","17:30","Munene, Julius","Naibet","Operator","Chu","","Neutral","",{"Pineapple":2},""),
  mkm("2026-01-19","18:00","Raluca, Marvin, Mirjana","Superbet","Operator","Nina, Ray","Silvio","Their Stand","",{"Premium Kavalan":2,"Pineapple":3},"",true),
  mkm("2026-01-19","18:30","Marcelo","Multibet","Operator","Heitor","","Our Stand","",{"Kavalan Whiskey":1},""),
  mkm("2026-01-19","19:00","Chris","Betpawa","Operator","Bryam, Chu","Allen, Ray Jr.","Their Stand","",{"Premium Kavalan":1,"Pineapple":1},"Live"),
  mkm("2026-01-19","19:30","Hailee","Betway","Operator","Bryam, Chu","Ray Jr.","Their Stand","",{"Kavalan Whiskey":1,"Pineapple":2},"Integrating"),
  mkm("2026-01-19","20:00","Fernando, Daniel","ZeroUm","Operator","Heitor","","Our Stand","",{"Premium Kavalan":2,"Pineapple":2},"Live"),
  mkm("2026-01-20","09:00","Yannick","Hero Gaming","Operator","Bryam, Nina","","Their Stand","",{"Pineapple":1},""),
  mkm("2026-01-20","09:30","John","Betnacional","Operator","Heitor, Ray","","Our Stand","",{"Kavalan Whiskey":1},""),
  mkm("2026-01-20","10:00","Vanessa","Esportes da Sorte","Operator","Heitor","","Their Stand","",{},"Live"),
  mkm("2026-01-20","10:30","Joe","Flutter","Operator","Nina","Aisha","Their Stand","",{"Premium Kavalan":1,"Pineapple":2},"",true),
  mkm("2026-01-20","11:00","Anna, Chance","Entain","Operator","Nina","Aisha","Their Stand","",{"Premium Kavalan":1,"Pineapple":2},"",true),
  mkm("2026-01-20","11:30","Claudia","Solverde PT","Operator","","Silvio","Our Stand","",{"Kavalan Whiskey":1,"Pineapple":1},""),
  mkm("2026-01-20","12:00","Francois Gautier, Alexandre","Koral Play","Operator","Chu","","Neutral","",{"Pineapple":2},"Requesting"),
  mkm("2026-01-20","12:30","Tijana, Selena","Bragg","Aggregator","Heitor","","Their Stand","",{},"Live"),
  mkm("2026-01-20","13:00","Gabriele","Iziplay","Aggregator","Nina","","Their Stand","",{"Pineapple":1},""),
  mkm("2026-01-20","13:30","Liza","Slotegrator","Aggregator","Bryam","Allen","Our Stand","",{"Pineapple":1},""),
  mkm("2026-01-20","14:00","Ian","Timeless Tech","Aggregator","Bryam","Mert","Their Stand","",{},"Live",true),
  mkm("2026-01-20","14:30","Kirt","iGP/iGD","Aggregator","Nina","Aisha","Our Stand","",{"Pineapple":1},"Live",true),
  mkm("2026-01-20","15:00","Kostas","eSoftHall","Aggregator","","Aisha","Our Stand","",{"Pineapple":2},"Live"),
  mkm("2026-01-20","15:30","Vicky","TCG","Operator","","Steven","Our Stand","",{"Pineapple":2},"Live"),
  mkm("2026-01-20","16:00","Mauricio","Bandbet","Operator","Heitor","","Our Stand","",{"Kavalan Whiskey":1},"Live"),
  mkm("2026-01-20","16:30","Nicholas Yu","Betty","Operator","Chu","","Their Stand","",{"Pineapple":1},""),
  mkm("2026-01-20","17:00","Natallia, Rüveyda","Pronet Gaming","Aggregator","Bryam","Mert","Their Stand","",{"Kavalan Whiskey":2},"",true),
  mkm("2026-01-20","17:30","Didier","Golden Palace","Operator","","Aisha","Their Stand","",{"Kavalan Whiskey":1,"Pineapple":3},""),
  mkm("2026-01-20","18:00","Georgios Oikonomou","Stoiximan","Operator","","Silvio","Their Stand","",{"Premium Kavalan":1},""),
  mkm("2026-01-20","18:30","Malcolm","Superbet","Operator","Heitor","Steven","Our Stand","",{"Premium Kavalan":1},"",true),
  mkm("2026-01-20","19:00","Emre","Alea","Aggregator","Bryam","Mert","Their Stand","",{"Premium Kavalan":1},"",true),
  mkm("2026-01-20","19:30","Svetlana","Digitain","Operator","","Allen","Their Stand","",{"Premium Kavalan":1,"Pineapple":1},"Live"),
  mkm("2026-01-20","20:00","Sofia, Vdarivakis","Novibet","Operator","Nina, Bryam","Silvio","Their Stand","",{"Kavalan Whiskey":2},""),
  mkm("2026-01-21","09:00","Andreia","GiG","Platform Provider","Heitor","","Their Stand","",{},"First Contact"),
  mkm("2026-01-21","09:30","Cristian","EveryMatrix","Aggregator","Bryam","Mert","Their Stand","",{},""),
  mkm("2026-01-21","10:00","Lincoln, Dan","4PLAY/PAGOL","Operator","Heitor","","Our Stand","",{},""),
  mkm("2026-01-21","10:30","Diana, Zoltan, Marcin","mbit","Operator","","Aisha","Our Stand","",{"Pineapple":3},""),
  mkm("2026-01-21","11:00","Jacopo, Liza","QTech","Aggregator","Chu","Ray Jr.","Their Stand","",{"Pineapple":2},"Live"),
  mkm("2026-01-21","11:30","Daniel","Reevo Tech","Aggregator","Bryam, Nina","","Their Stand","",{},""),
  mkm("2026-01-21","12:00","Wesley, Mateus","4Win","Operator","Heitor","","Our Stand","",{"Kavalan Whiskey":1},""),
  mkm("2026-01-21","12:30","Nikos, Makis","OPAP","Operator","","Silvio","Their Stand","",{"Kavalan Whiskey":1,"Pineapple":2},""),
  mkm("2026-01-21","13:00","Neil","Superbet (Napoleon)","Operator","","Aisha","Our Stand","",{"Pineapple":3},""),
  mkm("2026-01-21","13:30","Amanda","Bragg","Aggregator","Heitor","","Their Stand","",{},"Live"),
  mkm("2026-01-21","14:00","Sarah","Bally's","Operator","Nina, Bryam","","Their Stand","",{"Kavalan Whiskey":1,"Pineapple":1},"",true),
  mkm("2026-01-21","14:30","Marko","Timeless Tech","Aggregator","Heitor","Steven","Our Stand","",{},"Live"),
  mkm("2026-01-21","15:00","Anderson","Aposta Ganha","Operator","Heitor","","Our Stand","",{"Kavalan Whiskey":1},""),
  mkm("2026-01-21","15:30","Saba, Arthur","Broadway (SPRITE)","Aggregator","Bryam","","Neutral","",{},""),
  mkm("2026-01-21","16:00","Joseph","Games Global","Aggregator","Nina, Heitor","","Their Stand","",{},""),
  mkm("2026-01-21","16:30","Gustavo","Cactus","Platform Provider","Heitor, Ray","","Their Stand","",{},""),
  mkm("2026-01-21","17:00","Igor","Slotegrator","Aggregator","Bryam","Allen","Their Stand","",{"Kavalan Whiskey":1,"Pineapple":1},"Live"),
  mkm("2026-01-21","17:30","Francesca, Matteo","BF Games","Aggregator","Nina","Silvio","Their Stand","",{"Pineapple":2},""),
  mkm("2026-01-21","18:00","Peter","Entain","Operator","Nina, Hector","","Their Stand","",{},""),
  mkm("2026-01-21","18:30","Sergery","GR8_Rocket","Operator","","Allen, Aisha","Our Stand","",{"Pineapple":2},""),
];

// ─── SiGMA EURASIA DUBAI 2026 ─────────────────────────────────────────────────
const SIGMA_DUBAI_MEETINGS = [
  mkm("2026-02-09","11:30","Tatiana","SoftGaming","Aggregator","Bryam","Allen","Our Stand","15G",{},""),
  mkm("2026-02-09","13:00","Nicolas","Dopa","Operator","Bryam","","Our Stand","15G",{},""),
];

// ─── SIGMA CAPE TOWN 2026 ─────────────────────────────────────────────────────
const SIGMA_CT_MEETINGS = [
  mkm("2026-03-04","19:00","Senthil, Tyler","Sunbet","Operator","Bryam, Chu","Ray Jr.","Dinner","",{"Premium Kavalan":3},""),
];

// ─── SIGMA SAO PAULO 2026 ─────────────────────────────────────────────────────
const SIGMA_SP_MEETINGS = [
  mkm("2026-04-07","09:30","Pablo","Alea","Aggregator","Heitor","","Our Stand","N105",{},""),
  mkm("2026-04-07","10:00","Angelo","7K","Operator","Heitor, Ray","","Our Stand","N105",{"Premium Kavalan":1,"Pineapple":2},""),
  mkm("2026-04-07","10:30","Rafael","Superbet","Operator","Heitor","","Our Stand","N105",{"Premium Kavalan":1,"Pineapple":2},""),
  mkm("2026-04-07","10:30","Lucas","Superbet","Operator","Max","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-07","11:00","Hugo","Esportes da Sorte","Operator","Heitor","","Our Stand","N105",{},""),
  mkm("2026-04-07","11:30","Rosa, Fellipe, Pedro","9D","Operator","","Steven","Neutral","",{"Pineapple":3},""),
  mkm("2026-04-07","11:30","Anderson","Aposta Ganha","Operator","Heitor","","Our Stand","N105",{"Premium Kavalan":1,"Pineapple":2},""),
  mkm("2026-04-07","12:30","Ali","Stake","Operator","Heitor","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-07","13:00","Jose Ortega","Aprieta Y Gana","Operator","Heitor, Bryam","","Our Stand","N105",{"Premium Kavalan":1,"Pineapple":1},""),
  mkm("2026-04-07","13:00","Victor","Pixbet","Operator","Heitor","","Our Stand","N105",{"Premium Kavalan":1,"Pineapple":1},""),
  mkm("2026-04-07","13:30","Lucas","Rivalo","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-07","14:00","Mauricio","Bandbet","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-07","14:30","Vitor","Rei Do Pitaco","Operator","Heitor","","Our Stand","N105",{"Premium Kavalan":1,"Pineapple":1},""),
  mkm("2026-04-07","15:00","BrazilVegas & Yuri","BrazilVegas","Marketing","Heitor","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-07","15:30","Celso","Blaze","Operator","Heitor","","Their Stand","M160",{"Pineapple":1},""),
  mkm("2026-04-07","16:00","Dan, Italo","4PLAY/PAGOL","Operator","Heitor","","Our Stand","N105",{"Premium Kavalan":1,"Pineapple":2},""),
  mkm("2026-04-08","10:00","Mauro","HiperBet","Operator","Heitor","","Our Stand","N105",{},""),
  mkm("2026-04-08","10:30","Bianca","A2FBR","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-08","11:00","Junior","DonaldBet","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-08","11:30","Gabriel","Plugnplay","Aggregator","Heitor","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-08","12:00","Sara, Amanda","Bragg","Aggregator","Heitor","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-08","12:30","Dan, Pinho","4PLAY/PAGOL","Operator","Heitor","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-08","13:00","Rimma, Alina, Julia","BetBoom","Operator","Heitor","","Our Stand","N105",{"Pineapple":3},""),
  mkm("2026-04-08","13:30","Gabi","Oddsgates","Platform Provider","Heitor, Ray","","Our Stand","N105",{},""),
  mkm("2026-04-08","14:00","Myrella","KTO","Operator","Heitor","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-08","14:30","Elaine","Digiplus","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-08","15:00","Fernanda","EstrelaBet","Operator","Heitor","","Our Stand","N105",{"Pineapple":2},""),
  mkm("2026-04-08","15:30","Fabio","Inplaysoft","Platform Provider","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-08","16:00","Julia","Aposta Tudo","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-09","10:00","Jessica","Softswiss Brazil","Operator","Heitor","","Our Stand","N105",{},""),
  mkm("2026-04-09","10:30","Heitor","NGX","Platform Provider","Heitor","","Our Stand","N105",{},""),
  mkm("2026-04-09","11:00","Pamela","Betbra","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-09","11:30","Wellington","B1Bet","Operator","","","Our Stand","N105",{},""),
  mkm("2026-04-09","14:00","Thalissa, Tagiane, Hugo","Cactus","Platform Provider","Heitor","","Their Stand","",{"Pineapple":3},""),
  mkm("2026-04-09","14:30","Fernando","Focus Gaming News","Marketing","Heitor, Bryam","","Neutral","Media Lounge",{"Pineapple":2},""),
  mkm("2026-04-09","15:00","Carlos","BRBET","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-09","15:30","Ana","Salsa","Aggregator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-09","16:00","Paulo","Casa De Apostas","Operator","Heitor","","Our Stand","N105",{"Pineapple":1},""),
  mkm("2026-04-09","16:30","Marcelo","Yogonet","Marketing","Heitor","","Our Stand","N105",{"Pineapple":1},""),
];

const EXHIBITIONS_SEED = [
  {id:"ex1",name:"ICE Barcelona",year:2026,dates:"Jan 19–21, 2026",location:"Barcelona, Spain",standNumber:"",meetings:ICE_MEETINGS},
  {id:"ex2",name:"SiGMA Eurasia Dubai",year:2026,dates:"Feb 9–11, 2026",location:"Festival Arena, Dubai, UAE",standNumber:"15G",meetings:SIGMA_DUBAI_MEETINGS},
  {id:"ex3",name:"Sigma Cape Town",year:2026,dates:"Mar 4–5, 2026",location:"Sun Exhibitions, Cape Town, SA",standNumber:"091",meetings:SIGMA_CT_MEETINGS},
  {id:"ex4",name:"Sigma Sao Paulo",year:2026,dates:"Apr 7–9, 2026",location:"São Paulo, Brazil",standNumber:"N105",meetings:SIGMA_SP_MEETINGS},
];

// ─── BUSINESS TRIPS ───────────────────────────────────────────────────────────
const mkl = (d,city,client,contact,type,time,gifts,loc,status,notes="") =>
  ({id:uid(),date:d,city,client,contact,meetingType:type,time,gifts,location:loc,status,notes});

const BUSINESS_TRIPS_SEED = [{
  id:"bt1",name:"Brazil & Latam Trip",year:2026,dates:"Apr 10 – Apr 30, 2026",description:"Post-Sigma São Paulo: Brazil, Argentina, Peru",
  legs:[
    mkl("2026-04-10","São Paulo","Zero Um","Fernando Lemos","Dinner","TBC","X","Xingu, 512 – Alphaville / Barueri","Confirmed"),
    mkl("2026-04-14","Buenos Aires","HotBet / Juega.py","","Office Visit","14:00","1 Jaguar Cup + 1 Charging Pad + 1 Bottle Opener","","Confirming"),
    mkl("2026-04-14","Buenos Aires","HUB88","","Meeting","14:00","1 JBL + 1 Stanley + 1 Charging Pad","","Confirming"),
    mkl("2026-04-16","Lima","Apuesta Total","","Meeting","12:00","1 JBL + 2 Stanley + 2 Charging Pad","","Confirmed"),
    mkl("2026-04-16","Lima","Atlantic City","","Meeting","16:00","1 JBL + 1 Stanley + 1 Charging Pad","","Confirmed"),
    mkl("2026-04-17","Lima","Somos Casino","","Meeting","11:00","1 Stanley + 1 Charging Pad + 1 Jaguar Cup","","Confirmed"),
    mkl("2026-04-17","Lima","PalmsBet","","Meeting","13:00","1 Jaguar Cup + 1 Charging Pad + 1 Bottle Opener","","Confirmed"),
    mkl("2026-04-17","Lima","LaFija","","Meeting","16:00","1 Jaguar Cup + 1 Charging Pad + 1 Bottle Opener","Vittore Carpaccio 130, Lima 15036, Peru","Confirmed"),
    mkl("2026-04-19","Belo Horizonte","Rei Do Pitaco / Playtech","","Dinner","TBC","1 Stanley + 1 JBL","Dinner in Belo Horizonte","Confirmed"),
    mkl("2026-04-20","Belo Horizonte","Cactus","","Lunch","09:00","X","Rodovia Januário Carneiro, 8620, 11º andar, Nova Lima - MG","Confirmed"),
    mkl("2026-04-20","Belo Horizonte","ANA Gaming","","Meeting","14:00","1 JBL + 1 Stanley + 1 Charging Pad","Alameda Oscar Niemeyer, 132, 12 andar, Nova Lima - MG","Confirmed"),
    mkl("2026-04-22","Belo Horizonte","KTO","","Dinner","TBC","X","","Confirmed"),
    mkl("2026-04-23","São Paulo","VBET","","Meeting","10:00","","Alameda Santos, 415 - Vila Mariana","Confirmed"),
    mkl("2026-04-23","São Paulo","Esportes da Sorte","","Dinner","15:00","X","Av. Eng. Luís Carlos Berrini, 105 - Torre Berrini One, Andar 26","Confirmed"),
    mkl("2026-04-24","São Paulo","Superbet","","Lunch","11:00","X","Av. das Nações Unidas, 12995 - 6º Andar","Confirmed"),
    mkl("2026-04-27","São Paulo","NSX","","Meeting","11:00","X","Av. Brigadeiro Faria Lima, 3600, 7º andar - Itaim Bibi","Confirmed"),
  ]
}];

const GIFT_CATS_DEFAULT = ["Premium Kavalan","Kavalan Whiskey","Pineapple","Cookie","GaoLiang"];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const SK={contacts:"crm_contacts5",companies:"crm_companies3",team:"crm_team2",exhibitions:"crm_exhibitions5",giftCats:"crm_gift_cats2",businessTrips:"crm_business_trips2"};
const sload=async(k,fb)=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):fb;}catch{return fb;}};
const ssave=async(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SC={"Live":"bg-emerald-50 text-emerald-700 border-emerald-200","Integrating":"bg-blue-50 text-blue-700 border-blue-200","Contracting":"bg-violet-50 text-violet-700 border-violet-200","Contact":"bg-gray-100 text-gray-600 border-gray-200","Pending Integration":"bg-amber-50 text-amber-700 border-amber-200","Pending Live":"bg-amber-50 text-amber-700 border-amber-200","Stuck":"bg-red-50 text-red-600 border-red-200","Requesting Aggregator":"bg-orange-50 text-orange-700 border-orange-200","Requesting":"bg-orange-50 text-orange-700 border-orange-200","Critical ⚠️":"bg-red-50 text-red-700 border-red-300","First Contact":"bg-sky-50 text-sky-700 border-sky-200","Confirmed":"bg-emerald-50 text-emerald-700 border-emerald-200","Confirming":"bg-amber-50 text-amber-700 border-amber-200"};
const PC={"High":"text-orange-600","Critical ⚠️":"text-red-600","Medium":"text-amber-600","Low":"text-gray-400","Live, N/A":"text-emerald-600"};
const MLOC={"Our Stand":"🏠","Their Stand":"🏢","Neutral":"☕","Virtual":"💻","Dinner":"🍽️","Media Lounge":"📺"};
const MTYPE={"Meeting":"🤝","Office Visit":"🏢","Dinner":"🍽️","Lunch":"🍱"};
const CITY_C={"São Paulo":"bg-green-50 text-green-700 border-green-200","Buenos Aires":"bg-blue-50 text-blue-700 border-blue-200","Lima":"bg-amber-50 text-amber-700 border-amber-200","Belo Horizonte":"bg-violet-50 text-violet-700 border-violet-200","Brasilia":"bg-sky-50 text-sky-700 border-sky-200"};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Badge=({label,colorClass})=><span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${colorClass||"bg-gray-100 text-gray-600 border-gray-200"}`}>{label}</span>;

const Modal=({title,onClose,children,wide,xl})=>(
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col ${xl?"w-full max-w-5xl":wide?"w-full max-w-3xl":"w-full max-w-lg"} max-h-[90vh]`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18}/></button>
      </div>
      <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
    </div>
  </div>
);

const Input=({label,value,onChange,placeholder,type="text",className=""})=>(
  <div className={`flex flex-col gap-1 ${className}`}>
    {label&&<label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"/>
  </div>
);

const Sel=({label,value,onChange,options,placeholder,className=""})=>(
  <div className={`flex flex-col gap-1 ${className}`}>
    {label&&<label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100">
      {placeholder&&<option value="">{placeholder}</option>}
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Toggle=({label,value,onChange})=>(
  <div className="flex items-center gap-2">
    <button onClick={()=>onChange(!value)} style={{minWidth:40,height:22}} className={`rounded-full relative flex items-center transition-colors ${value?"bg-amber-400":"bg-gray-200"}`}>
      <span className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${value?"translate-x-5":"translate-x-1"}`}/>
    </button>
    {label&&<span className="text-sm text-gray-700">{label}</span>}
  </div>
);

const AC=({value,onChange,onSelect,suggestions,placeholder})=>{
  const [open,setOpen]=useState(false);const[filt,setFilt]=useState([]);const ref=useRef();
  useEffect(()=>{if(value.length>=1){const f=suggestions.filter(s=>s.toLowerCase().includes(value.toLowerCase())).slice(0,8);setFilt(f);setOpen(f.length>0);}else setOpen(false);},[value,suggestions]);
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  return(
    <div ref={ref} className="relative">
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"/>
      {open&&<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full max-h-48 overflow-y-auto">
        {filt.map(s=><div key={s} onMouseDown={()=>{onSelect(s);setOpen(false);}} className="px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer">{s}</div>)}
      </div>}
    </div>
  );
};

// ─── CSV PARSER ───────────────────────────────────────────────────────────────
const parseCSV=(text)=>{
  const lines=text.split(/\r?\n/).filter(l=>l.trim());if(lines.length<2)return[];
  const headers=lines[0].split(',').map(h=>h.trim().replace(/^"|"$/g,'').toLowerCase());
  return lines.slice(1).map(line=>{
    const vals=[];let cur='',inQ=false;
    for(const ch of line){if(ch==='"'){inQ=!inQ;}else if(ch===','&&!inQ){vals.push(cur.trim());cur='';}else cur+=ch;}
    vals.push(cur.trim());
    const row={};headers.forEach((h,i)=>{row[h]=vals[i]?.replace(/^"|"$/g,'')||'';});return row;
  });
};
const mapRow=(row)=>{
  const nk=Object.keys(row).find(k=>k.includes('name'));const ek=Object.keys(row).find(k=>k.includes('email')||k.includes('mail'));
  const ck=Object.keys(row).find(k=>k.includes('company')||k.includes('org'));const tk=Object.keys(row).find(k=>k.includes('title')||k.includes('position')||k.includes('role'));
  const pk=Object.keys(row).find(k=>k.includes('phone')||k.includes('tel')||k.includes('mobile'));
  const name=nk?row[nk]:'';if(!name.trim())return null;
  return{id:uid(),name:name.trim(),title:tk?row[tk]:'',company:ck?row[ck]:'',phone:pk?row[pk]:'',email:ek?row[ek]:'',linkedin:'',dinnerPref:'',giftPref:'',notes:''};
};

// ─── CONTACT SLIDE-OUT ────────────────────────────────────────────────────────
const ContactSlideOut=({contact,onClose,setContacts,exhibitions,businessTrips})=>{
  const [editMode,setEditMode]=useState(false);
  const [form,setForm]=useState({...contact});
  useEffect(()=>{setForm({...contact});setEditMode(false);},[contact.id]);

  const save=()=>{
    setContacts(prev=>prev.map(c=>c.id===contact.id?{...c,...form}:c));
    setEditMode(false);
  };

  const FI=(k,l,p)=>(
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{l}</label>
      <input value={form[k]||""} onChange={e=>setForm(pr=>({...pr,[k]:e.target.value}))} placeholder={p}
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400"/>
    </div>
  );
  const FT=(k,l,p)=>(
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{l}</label>
      <textarea value={form[k]||""} onChange={e=>setForm(pr=>({...pr,[k]:e.target.value}))} placeholder={p} rows={2}
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none"/>
    </div>
  );

  const history=useMemo(()=>{
    const items=[];
    const norm=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[\s\-_.,&'()\/]/g,'');
    const fn=norm(contact.name.split(' ')[0]);
    const cCo=norm(contact.company);
    exhibitions.forEach(ex=>ex.meetings.forEach(m=>{
      const cnParts=(m.contactNames||'').split(',').map(p=>norm(p.trim().split(' ')[0]));
      if(!cnParts.includes(fn))return;
      const meetCo=norm(m.company);
      const companyMatch=cCo.length>2&&meetCo.length>2&&(cCo.includes(meetCo.slice(0,5))||meetCo.includes(cCo.slice(0,5)));
      if(companyMatch){items.push({type:'exhibition',event:`${ex.name} ${ex.year}`,date:m.date,company:m.company,gifts:m.gifts||{},status:m.status});}
    }));
    businessTrips.forEach(bt=>bt.legs.forEach(l=>{
      if((l.contact||'').toLowerCase().includes(fn)){items.push({type:'trip',event:bt.name,date:l.date,company:l.client,gifts:{},giftsText:l.gifts,status:l.status});}
    }));
    return items.sort((a,b)=>a.date>b.date?-1:1);
  },[contact,exhibitions,businessTrips]);
  const totalGifts={};history.forEach(h=>Object.entries(h.gifts||{}).forEach(([k,v])=>{totalGifts[k]=(totalGifts[k]||0)+v;}));

  return(
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-gray-200" onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg mb-3">{contact.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
            <h2 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>{editMode?form.name:contact.name}</h2>
            {(editMode?form.title:contact.title)&&<p className="text-sm text-gray-500">{editMode?form.title:contact.title}</p>}
            {(editMode?form.company:contact.company)&&<p className="text-sm font-medium text-amber-600">{editMode?form.company:contact.company}</p>}
          </div>
          <div className="flex gap-2">
            {!editMode&&<button onClick={()=>setEditMode(true)} className="text-gray-400 hover:text-amber-500 border border-gray-200 rounded-lg p-1.5 transition-colors" title="Edit"><Edit2 size={14}/></button>}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg p-1.5"><X size={14}/></button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          {editMode?(
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 font-medium">Editing — all fields below are editable</div>
              {FI("name","Full Name","e.g. Jordan Shelley")}
              {FI("title","Title","e.g. Head of Casino")}
              {FI("company","Company","e.g. Entain")}
              {FI("phone","Phone","e.g. +44 7700 900000")}
              {FI("email","Email","e.g. name@company.com")}
              {FI("linkedin","LinkedIn URL","https://linkedin.com/in/...")}
              <div className="border-t border-dashed border-amber-200 pt-3 space-y-3">
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Preferences</div>
                {FT("dinnerPref","🍽️  Dinner Preference","e.g. Vegetarian, No pork, Halal, Loves steak...")}
                {FT("giftPref","🎁  Gift Preference","e.g. Loves whiskey, no alcohol, practical gifts...")}
              </div>
              {FT("notes","📝  Notes","Any additional notes...")}
              <div className="flex gap-2 pt-1 pb-4">
                <button onClick={save} className="flex-1 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm">Save Changes</button>
                <button onClick={()=>{setForm({...contact});setEditMode(false);}} className="flex-1 border border-gray-200 text-gray-500 hover:text-gray-800 text-sm py-2.5 rounded-lg">Cancel</button>
              </div>
            </div>
          ):(
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact Info</h3>
                <div className="space-y-1.5">
                  {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"><Mail size={13}/>{contact.email}</a>}
                  {contact.phone&&<span className="flex items-center gap-2 text-sm text-gray-600"><Phone size={13}/>{contact.phone}</span>}
                  {contact.linkedin&&<a href={contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-sky-600"><Linkedin size={13}/>LinkedIn Profile</a>}
                  {!contact.email&&!contact.phone&&!contact.linkedin&&<button onClick={()=>setEditMode(true)} className="text-xs text-gray-400 hover:text-amber-500 italic flex items-center gap-1"><Plus size={11}/>Add contact info</button>}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferences</h3>
                  <button onClick={()=>setEditMode(true)} className="text-xs text-amber-500 hover:text-amber-600 flex items-center gap-1"><Edit2 size={10}/>Edit</button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2"><UtensilsCrossed size={14} className="text-amber-500 mt-0.5 shrink-0"/>
                    <div><div className="text-xs font-medium text-gray-500">Dinner</div>
                      {contact.dinnerPref?<div className="text-sm text-gray-700">{contact.dinnerPref}</div>:<button onClick={()=>setEditMode(true)} className="text-xs text-gray-300 hover:text-amber-500 italic">Click to add</button>}
                    </div>
                  </div>
                  <div className="flex items-start gap-2"><Heart size={14} className="text-rose-400 mt-0.5 shrink-0"/>
                    <div><div className="text-xs font-medium text-gray-500">Gift Preference</div>
                      {contact.giftPref?<div className="text-sm text-gray-700">{contact.giftPref}</div>:<button onClick={()=>setEditMode(true)} className="text-xs text-gray-300 hover:text-amber-500 italic">Click to add</button>}
                    </div>
                  </div>
                </div>
              </div>
              {contact.notes?<div><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</h3><p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{contact.notes}</p></div>
                :<button onClick={()=>setEditMode(true)} className="text-xs text-gray-300 hover:text-amber-500 italic flex items-center gap-1"><Plus size={11}/>Add notes</button>}
              {Object.keys(totalGifts).length>0&&<div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gifts Received</h3>
                <div className="flex flex-wrap gap-2">{Object.entries(totalGifts).map(([g,v])=><span key={g} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded-full font-medium">{g} × {v}</span>)}</div>
              </div>}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Event History ({history.length})</h3>
                {history.length===0?<p className="text-sm text-gray-300 italic">Not found in any events</p>:
                  <div className="space-y-2">{history.map((h,i)=>(
                    <div key={i} className="border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">{h.event}</span>
                        {h.status&&<Badge label={h.status} colorClass={SC[h.status]}/>}
                      </div>
                      <div className="text-xs text-gray-400">{h.date} · {h.company}</div>
                      {Object.keys(h.gifts||{}).length>0&&<div className="mt-1 flex flex-wrap gap-1">{Object.entries(h.gifts).map(([g,v])=><span key={g} className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">{g} ×{v}</span>)}</div>}
                      {h.giftsText&&h.giftsText!=='X'&&<div className="mt-1 text-xs text-gray-500"><Tag size={10} className="inline mr-1"/>{h.giftsText}</div>}
                    </div>
                  ))}</div>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// ─── PREF TOOLTIP ─────────────────────────────────────────────────────────────
const PrefTooltip=({contact,children})=>{
  const [show,setShow]=useState(false);const hasPref=contact&&(contact.dinnerPref||contact.giftPref);
  if(!hasPref)return children;
  return(
    <div className="relative inline-block" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show&&<div className="absolute left-0 top-full mt-1 z-30 bg-white border border-amber-200 rounded-lg shadow-lg px-3 py-2 min-w-48 text-xs pointer-events-none">
        {contact.dinnerPref&&<div className="flex items-center gap-1.5 mb-1"><UtensilsCrossed size={11} className="text-amber-500"/><span className="text-gray-600">{contact.dinnerPref}</span></div>}
        {contact.giftPref&&<div className="flex items-center gap-1.5"><Heart size={11} className="text-rose-400"/><span className="text-gray-600">{contact.giftPref}</span></div>}
      </div>}
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard=({contacts,companies,exhibitions,businessTrips,giftCats})=>{
  const totalGifts=exhibitions.reduce((s,e)=>e.meetings.reduce((ms,m)=>ms+Object.values(m.gifts||{}).reduce((g,v)=>g+v,0),s),0);
  const liveClients=companies.filter(c=>c.status==="Live").length;
  const totalMeetings=exhibitions.reduce((s,e)=>s+e.meetings.length,0);
  const giftTotals={};giftCats.forEach(g=>giftTotals[g]=0);
  exhibitions.forEach(e=>e.meetings.forEach(m=>Object.entries(m.gifts||{}).forEach(([k,v])=>{if(giftTotals[k]!==undefined)giftTotals[k]+=v;})));
  const max=Math.max(...Object.values(giftTotals),1);
  return(
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-1" style={{fontFamily:"'Cormorant Garant',serif"}}>Dashboard</h1><p className="text-gray-400">Your client relationship overview.</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[[contacts.length,"Contacts",Users,"bg-blue-50 text-blue-600"],[companies.length,"Companies",Building2,"bg-amber-50 text-amber-600"],[liveClients,"Live Clients",CheckCircle2,"bg-emerald-50 text-emerald-600"],[exhibitions.length,"Exhibitions",Calendar,"bg-violet-50 text-violet-600"],[totalMeetings,"Meetings",UserCheck,"bg-sky-50 text-sky-600"],[totalGifts,"Gifts Sent",Gift,"bg-rose-50 text-rose-600"]].map(([v,l,I,c])=>(
          <div key={l} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`${c} rounded-lg p-2.5`}><I size={20}/></div>
            <div><div className="text-2xl font-bold text-gray-900">{v}</div><div className="text-xs text-gray-500">{l}</div></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Gift size={16} className="text-amber-500"/>Gift Tracker</h3>
          {giftCats.map(g=>(
            <div key={g} className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">{g}</span>
              <div className="flex items-center gap-3">
                <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{width:`${Math.min(100,(giftTotals[g]||0)/max*100)}%`}}/></div>
                <span className="text-sm font-semibold text-amber-600 w-6 text-right">{giftTotals[g]||0}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Calendar size={16} className="text-amber-500"/>Exhibitions</h3>
          {exhibitions.slice().reverse().slice(0,5).map(e=>(
            <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div><div className="text-sm font-medium text-gray-800">{e.name} {e.year}</div><div className="text-xs text-gray-400">{e.dates}</div></div>
              <Badge label={`${e.meetings.length} meetings`} colorClass="bg-amber-50 text-amber-700 border-amber-200"/>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Briefcase size={16} className="text-amber-500"/>Business Trips</h3>
          {businessTrips.length===0?<p className="text-gray-400 text-sm">No trips yet.</p>:businessTrips.map(bt=>(
            <div key={bt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div><div className="text-sm font-medium text-gray-800">{bt.name}</div><div className="text-xs text-gray-400">{bt.dates}</div></div>
              <Badge label={`${bt.legs.length} stops`} colorClass="bg-violet-50 text-violet-700 border-violet-200"/>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Building2 size={16} className="text-amber-500"/>Pipeline</h3>
          {["Live","Integrating","Contracting","Contact","Stuck","Pending Live"].map(s=>(
            <div key={s} className="flex items-center justify-between mb-2"><Badge label={s} colorClass={SC[s]}/><span className="text-sm text-gray-700 font-medium">{companies.filter(c=>c.status===s).length}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CONTACTS PAGE ────────────────────────────────────────────────────────────
const ContactsPage=({contacts,setContacts,exhibitions,businessTrips,onOpenSlideOut})=>{
  const [search,setSearch]=useState("");const[editing,setEditing]=useState(null);const[form,setForm]=useState({});
  const [csvStatus,setCsvStatus]=useState(null);const[reviewing,setReviewing]=useState(null);const fileRef=useRef();
  const filtered=useMemo(()=>contacts.filter(c=>[c.name,c.company,c.title,c.email].join(" ").toLowerCase().includes(search.toLowerCase())),[contacts,search]);
  const {sorted:sortedContacts,Th:CTh}=useSort(filtered,'name','asc');
  const openNew=()=>{setForm({id:uid(),name:"",title:"",company:"",phone:"",email:"",linkedin:"",dinnerPref:"",giftPref:"",notes:""});setEditing("new");};
  const openEdit=c=>{setForm({...c});setEditing(c.id);};
  const saveFn=()=>{if(!form.name?.trim())return;setContacts(prev=>editing==="new"?[...prev,form]:prev.map(c=>c.id===editing?form:c));setEditing(null);};
  const del=id=>setContacts(prev=>prev.filter(c=>c.id!==id));
  const handleCSV=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const rows=parseCSV(ev.target.result);const incoming=rows.map(mapRow).filter(Boolean);
      if(!incoming.length){setCsvStatus({ok:false,msg:"No contacts found. Check CSV has a 'name' column."});return;}
      const existEmails=new Set(contacts.map(c=>c.email?.toLowerCase()).filter(Boolean));
      const existNames=new Set(contacts.map(c=>c.name?.toLowerCase()).filter(Boolean));
      const dupes=incoming.filter(c=>(c.email&&existEmails.has(c.email.toLowerCase()))||(existNames.has(c.name?.toLowerCase())));
      const fresh=incoming.filter(c=>!dupes.includes(c));
      setContacts(prev=>[...prev,...fresh]);
      if(dupes.length>0){setReviewing({duplicates:dupes,msg:`Imported ${fresh.length} contacts. ${dupes.length} flagged for review:`});}
      else setCsvStatus({ok:true,msg:`✅ Imported ${fresh.length} contacts.`});
    };
    reader.readAsText(file);e.target.value="";
  };
  const resolveDup=(c,action)=>{
    if(action==="keep"){setContacts(prev=>prev.map(e=>e.email?.toLowerCase()===c.email?.toLowerCase()||e.name?.toLowerCase()===c.name?.toLowerCase()?{...e,...c,id:e.id}:e));}
    else if(action==="add"){setContacts(prev=>[...prev,{...c,id:uid()}]);}
    setReviewing(r=>{const rest=r.duplicates.filter(d=>d!==c);return rest.length?{...r,duplicates:rest}:null;});
  };
  const exportJSON=()=>{
    const blob=new Blob([JSON.stringify({contacts,exhibitions,businessTrips},null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="crm-contacts-export.json";a.click();
  };
  const F=(k,l,p,ta)=>ta?(
    <div className="flex flex-col gap-1 col-span-2"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{l}</label>
      <textarea value={form[k]||""} onChange={e=>setForm(pr=>({...pr,[k]:e.target.value}))} placeholder={p} rows={3} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none"/></div>
  ):<Input label={l} value={form[k]||""} onChange={v=>setForm(pr=>({...pr,[k]:v}))} placeholder={p}/>;
  return(
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>Contacts</h1><p className="text-gray-400 text-sm">{contacts.length} people</p></div>
        <div className="flex gap-2 flex-wrap">
          <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden"/>
          <button onClick={exportJSON} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:text-gray-900 text-sm px-3 py-2 rounded-lg shadow-sm"><Download size={14}/>Export</button>
          <button onClick={()=>fileRef.current.click()} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:text-gray-900 text-sm px-3 py-2 rounded-lg shadow-sm"><Upload size={14}/>Import CSV</button>
          <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"><Plus size={16}/>Add</button>
        </div>
      </div>
      {csvStatus&&<div className={`mb-4 text-sm px-4 py-2 rounded-lg border flex items-center justify-between ${csvStatus.ok?"bg-emerald-50 border-emerald-200 text-emerald-700":"bg-red-50 border-red-200 text-red-700"}`}><span>{csvStatus.msg}</span><button onClick={()=>setCsvStatus(null)}><X size={14}/></button></div>}
      <div className="mb-3 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg">💡 CSV columns: <code>name</code>, <code>email</code>, <code>company</code>, <code>title</code>, <code>phone</code> · Duplicates flagged for review · Click any name to open profile panel</div>
      <div className="relative mb-4"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, company, title, email..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-amber-400 shadow-sm"/></div>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider bg-gray-50">
            <CTh col="name" label="Name"/>
            <CTh col="title" label="Title"/>
            <CTh col="company" label="Company"/>
            <th className="text-left px-3 py-3 hidden lg:table-cell">Email / Phone</th>
            <th className="text-left px-3 py-3 hidden lg:table-cell">Preferences</th>
            <th className="text-right px-3 py-3">Actions</th>
          </tr></thead>
          <tbody>{sortedContacts.map((c,i)=>(
            <tr key={c.id} className={`border-b border-gray-50 hover:bg-amber-50/20 ${i%2===1?"bg-gray-50/30":""}`}>
              <td className="px-4 py-3"><button onClick={()=>onOpenSlideOut(c)} className="font-medium text-gray-900 hover:text-amber-600 hover:underline text-left">{c.name}</button></td>
              <td className="px-4 py-3 text-gray-500 text-xs">{c.title||<span className="text-gray-300">—</span>}</td>
              <td className="px-4 py-3 text-gray-700 text-sm">{c.company||<span className="text-gray-300">—</span>}</td>
              <td className="px-4 py-3 hidden lg:table-cell"><div className="flex flex-col gap-0.5">
                {c.email&&<a href={`mailto:${c.email}`} className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs truncate max-w-44"><Mail size={10}/>{c.email}</a>}
                {c.phone&&<span className="text-gray-400 flex items-center gap-1 text-xs"><Phone size={10}/>{c.phone}</span>}
                {c.linkedin&&<a href={c.linkedin} target="_blank" rel="noreferrer" className="text-sky-500 flex items-center gap-1 text-xs"><Linkedin size={10}/>LinkedIn</a>}
              </div></td>
              <td className="px-4 py-3 hidden lg:table-cell"><div className="flex flex-col gap-0.5 text-xs">
                {c.dinnerPref&&<span className="text-gray-600 flex items-center gap-1"><UtensilsCrossed size={10} className="text-amber-400"/>{c.dinnerPref}</span>}
                {c.giftPref&&<span className="text-gray-600 flex items-center gap-1"><Heart size={10} className="text-rose-400"/>{c.giftPref}</span>}
                {!c.dinnerPref&&!c.giftPref&&<span className="text-gray-300">—</span>}
              </div></td>
              <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2">
                <button onClick={()=>onOpenSlideOut(c)} className="text-gray-300 hover:text-amber-500" title="View profile"><Users size={13}/></button>
                <button onClick={()=>openEdit(c)} className="text-gray-300 hover:text-amber-500"><Edit2 size={13}/></button>
                <button onClick={()=>del(c.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={13}/></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {sortedContacts.length===0&&<div className="text-center py-12 text-gray-400">No contacts found</div>}
      </div>
      {editing&&(
        <Modal title={editing==="new"?"Add Contact":"Edit Contact"} onClose={()=>setEditing(null)} wide>
          <div className="grid grid-cols-2 gap-4">
            {F("name","Full Name *","e.g. Eduard Verdaguer")}{F("title","Title","e.g. Head of Casino")}
            {F("company","Company","e.g. Alea")}{F("phone","Phone","e.g. +34606870643")}
            {F("email","Email","e.g. name@company.com")}{F("linkedin","LinkedIn URL","https://linkedin.com/in/...")}
            {F("dinnerPref","Dinner Preference","e.g. Vegetarian, No pork")}{F("giftPref","Gift Preference","e.g. Loves whiskey, luxury items")}
            {F("notes","Notes","Any notes...",true)}
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={()=>setEditing(null)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={saveFn} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Save</button>
          </div>
        </Modal>
      )}
      {reviewing&&(
        <Modal title={`Review Duplicates (${reviewing.duplicates.length} remaining)`} onClose={()=>setReviewing(null)} wide>
          <p className="text-sm text-gray-500 mb-4">{reviewing.msg}</p>
          <div className="space-y-3 max-h-80 overflow-y-auto">{reviewing.duplicates.map(c=>(
            <div key={c.id} className="border border-amber-200 bg-amber-50 rounded-lg p-3 flex items-center justify-between gap-3">
              <div><div className="font-medium text-gray-800 text-sm">{c.name}</div><div className="text-xs text-gray-500">{c.company} · {c.email}</div></div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={()=>resolveDup(c,"keep")} className="text-xs bg-blue-500 text-white px-2 py-1 rounded-lg">Update existing</button>
                <button onClick={()=>resolveDup(c,"add")} className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-lg">Add as new</button>
                <button onClick={()=>resolveDup(c,"skip")} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-lg">Skip</button>
              </div>
            </div>
          ))}</div>
          <div className="mt-4 flex justify-end"><button onClick={()=>setReviewing(null)} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Done</button></div>
        </Modal>
      )}
    </div>
  );
};

// ─── COMPANIES PAGE ───────────────────────────────────────────────────────────
const CompaniesPage=({companies,setCompanies,team})=>{
  const [search,setSearch]=useState("");const[fBD,setFBD]=useState("");const[fSt,setFSt]=useState("");const[fTy,setFTy]=useState("");
  const [editing,setEditing]=useState(null);const[form,setForm]=useState({});
  const bdNames=team.filter(t=>t.role==="BD").map(t=>t.name);
  const statuses=["Live","Integrating","Contracting","Contact","Pending Integration","Pending Live","Stuck","Requesting Aggregator"];
  const types=["Operator","Aggregator","Platform","OP/AG","AG/Game"];
  const filtered=useMemo(()=>companies.filter(c=>{
    const txt=[c.name,c.bd,c.mainMarket].join(" ").toLowerCase();
    return(!search||txt.includes(search.toLowerCase()))&&(!fBD||c.bd?.includes(fBD))&&(!fSt||c.status===fSt)&&(!fTy||c.clientType===fTy);
  }),[companies,search,fBD,fSt,fTy]);
  const {sorted:sortedCompanies,Th:CoTh}=useSort(filtered,'name','asc');
  const openNew=()=>{setForm({id:uid(),name:"",bd:"",exhibitions:"",status:"Contact",clientType:"Operator",priority:"Medium",mainMarket:"",workingWith:""});setEditing("new");};
  const openEdit=c=>{setForm({...c});setEditing(c.id);};
  const saveFn=()=>{if(!form.name?.trim())return;setCompanies(prev=>editing==="new"?[...prev,form]:prev.map(c=>c.id===editing?form:c));setEditing(null);};
  const del=id=>setCompanies(prev=>prev.filter(c=>c.id!==id));
  return(
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>Client Companies</h1><p className="text-gray-400 text-sm">{companies.length} companies · {filtered.length} shown</p></div>
        <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"><Plus size={16}/>Add Company</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-48"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-amber-400 shadow-sm"/></div>
        {[["All BD",fBD,setFBD,bdNames.map(b=>({v:b,l:b.split(" ")[0]}))],["All Status",fSt,setFSt,statuses.map(s=>({v:s,l:s}))],["All Types",fTy,setFTy,types.map(t=>({v:t,l:t}))]].map(([ph,val,set,opts])=>(
          <select key={ph} value={val} onChange={e=>set(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 shadow-sm">
            <option value="">{ph}</option>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        ))}
      </div>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider bg-gray-50">
            <CoTh col="name" label="Company"/>
            <CoTh col="bd" label="BD"/>
            <CoTh col="status" label="Status" className="hidden md:table-cell"/>
            <CoTh col="clientType" label="Type" className="hidden md:table-cell"/>
            <CoTh col="priority" label="Priority" className="hidden lg:table-cell"/>
            <CoTh col="mainMarket" label="Market" className="hidden lg:table-cell"/>
            <th className="text-right px-3 py-3">Actions</th>
          </tr></thead>
          <tbody>{sortedCompanies.map((c,i)=>(
            <tr key={c.id} className={`border-b border-gray-50 hover:bg-amber-50/20 ${i%2===1?"bg-gray-50/30":""}`}>
              <td className="px-4 py-3"><div className="font-medium text-gray-900">{c.name}</div><div className="text-xs text-gray-400 truncate max-w-36 hidden lg:block">{c.exhibitions}</div></td>
              <td className="px-4 py-3 text-gray-500 text-xs">{c.bd}</td>
              <td className="px-4 py-3 hidden md:table-cell"><Badge label={c.status} colorClass={SC[c.status]}/></td>
              <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{c.clientType}</td>
              <td className={`px-4 py-3 hidden lg:table-cell text-xs font-semibold ${PC[c.priority]||"text-gray-400"}`}>{c.priority}</td>
              <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{c.mainMarket}</td>
              <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2">
                <button onClick={()=>openEdit(c)} className="text-gray-300 hover:text-amber-500"><Edit2 size={14}/></button>
                <button onClick={()=>del(c.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={14}/></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {sortedCompanies.length===0&&<div className="text-center py-12 text-gray-400">No companies found</div>}
      </div>
      {editing&&(
        <Modal title={editing==="new"?"Add Company":"Edit Company"} onClose={()=>setEditing(null)} wide>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name *" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. Betsson"/>
            <Sel label="Status" value={form.status||"Contact"} onChange={v=>setForm(p=>({...p,status:v}))} options={statuses}/>
            <Sel label="Client Type" value={form.clientType||"Operator"} onChange={v=>setForm(p=>({...p,clientType:v}))} options={types}/>
            <Sel label="Priority" value={form.priority||"Medium"} onChange={v=>setForm(p=>({...p,priority:v}))} options={["Critical ⚠️","High","Medium","Low","Live, N/A"]}/>
            <Input label="Main Market" value={form.mainMarket||""} onChange={v=>setForm(p=>({...p,mainMarket:v}))} placeholder="e.g. Brazil, Europe"/>
            <Input label="Working With" value={form.workingWith||""} onChange={v=>setForm(p=>({...p,workingWith:v}))} placeholder="e.g. Direct, Relax, LNW"/>
          </div>
          <div className="mt-3"><Input label="BD Owner" value={form.bd||""} onChange={v=>setForm(p=>({...p,bd:v}))} placeholder="e.g. Heitor Langa"/></div>
          <div className="mt-3"><Input label="Exhibitions Attended" value={form.exhibitions||""} onChange={v=>setForm(p=>({...p,exhibitions:v}))} placeholder="e.g. ICE Barcelona, SBC Lisbon"/></div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={()=>setEditing(null)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={saveFn} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── TEAM PAGE ────────────────────────────────────────────────────────────────
const TeamPage=({team,setTeam})=>{
  const [editing,setEditing]=useState(null);const[form,setForm]=useState({});
  const openNew=()=>{setForm({id:uid(),name:"",role:"BD",title:""});setEditing("new");};
  const openEdit=t=>{setForm({...t});setEditing(t.id);};
  const saveFn=()=>{if(!form.name?.trim())return;setTeam(prev=>editing==="new"?[...prev,form]:prev.map(t=>t.id===editing?form:t));setEditing(null);};
  const del=id=>setTeam(prev=>prev.filter(t=>t.id!==id));
  const RC={"BD":"bg-blue-50 text-blue-700 border-blue-200","AM":"bg-violet-50 text-violet-700 border-violet-200","MKT":"bg-rose-50 text-rose-700 border-rose-200"};
  const AC2={"BD":"bg-blue-500","AM":"bg-violet-500","MKT":"bg-rose-500"};
  return(
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>Our Team</h1><p className="text-gray-400 text-sm">{team.length} members</p></div>
        <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"><Plus size={16}/>Add</button>
      </div>
      {["BD","AM","MKT"].map(role=>(
        <div key={role} className="mb-8">
          <div className="flex items-center gap-2 mb-3"><Badge label={role} colorClass={RC[role]}/><span className="text-gray-400 text-sm">{team.filter(t=>t.role===role).length} members</span></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">{team.filter(t=>t.role===role).map(t=>(
            <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
              <div className={`w-10 h-10 rounded-full ${AC2[role]} flex items-center justify-center text-white font-bold text-sm`}>{t.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
              <div><div className="font-medium text-gray-900 text-sm">{t.name}</div><div className="text-xs text-gray-400">{t.title}</div></div>
              <div className="flex items-center gap-2">
                <button onClick={()=>openEdit(t)} className="text-gray-300 hover:text-amber-500"><Edit2 size={13}/></button>
                <button onClick={()=>del(t.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={13}/></button>
              </div>
            </div>
          ))}</div>
        </div>
      ))}
      {editing&&(
        <Modal title={editing==="new"?"Add Member":"Edit Member"} onClose={()=>setEditing(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Full Name *" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. Aisha Kuo"/>
            <Sel label="Role" value={form.role||"BD"} onChange={v=>setForm(p=>({...p,role:v}))} options={["BD","AM","MKT"]}/>
            <Input label="Title" value={form.title||""} onChange={v=>setForm(p=>({...p,title:v}))} placeholder="e.g. Account Manager"/>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={()=>setEditing(null)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={saveFn} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── EXHIBITIONS PAGE ─────────────────────────────────────────────────────────
const ExhibitionsPage=({exhibitions,setExhibitions,setView,setSelectedExhibition})=>{
  const [openYears,setOpenYears]=useState({});const[showModal,setShowModal]=useState(false);const[form,setForm]=useState({});const[dupFrom,setDupFrom]=useState(null);
  const byYear=useMemo(()=>{const m={};exhibitions.forEach(e=>{if(!m[e.year])m[e.year]=[];m[e.year].push(e);});return Object.entries(m).sort(([a],[b])=>Number(b)-Number(a));},[exhibitions]);
  useEffect(()=>{if(byYear.length>0)setOpenYears({[byYear[0][0]]:true});},[]);
  const toggleYear=y=>setOpenYears(p=>({...p,[y]:!p[y]}));
  const openNew=()=>{setForm({id:uid(),name:"",year:new Date().getFullYear(),dates:"",location:"",standNumber:"",meetings:[]});setDupFrom(null);setShowModal(true);};
  const openDup=src=>{setForm({...src,id:uid(),year:typeof src.year==='number'?src.year+1:src.year,dates:"",standNumber:"",meetings:[]});setDupFrom(src.name);setShowModal(true);};
  const saveFn=()=>{if(!form.name?.trim())return;setExhibitions(prev=>[...prev,form]);setShowModal(false);};
  const del=id=>setExhibitions(prev=>prev.filter(e=>e.id!==id));
  const open=ex=>{setSelectedExhibition(ex);setView("exhibitionDetail");};
  return(
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>Exhibitions</h1><p className="text-gray-400 text-sm">{exhibitions.length} events across {byYear.length} year{byYear.length!==1?"s":""}</p></div>
        <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"><Plus size={16}/>New</button>
      </div>
      {byYear.map(([year,exs])=>(
        <div key={year} className="mb-4">
          <button onClick={()=>toggleYear(year)} className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 mb-2">
            <ChevronRight size={18} className={`text-gray-400 transition-transform ${openYears[year]?"rotate-90":""}`}/>
            {openYears[year]?<FolderOpen size={20} className="text-amber-500"/>:<Folder size={20} className="text-gray-400"/>}
            <span className="font-semibold text-gray-800 text-lg" style={{fontFamily:"'Cormorant Garant',serif"}}>{year}</span>
            <Badge label={`${exs.length} event${exs.length!==1?"s":""}`} colorClass="bg-amber-50 text-amber-700 border-amber-200"/>
            <span className="text-xs text-gray-400 ml-auto">{exs.reduce((s,e)=>s+e.meetings.length,0)} total meetings</span>
          </button>
          {openYears[year]&&(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-4 pb-2">{exs.map(ex=>{
              const totalGifts=ex.meetings.reduce((s,m)=>s+Object.values(m.gifts||{}).reduce((a,v)=>a+v,0),0);
              const ppt=ex.meetings.filter(m=>m.powerpointReady).length;
              return(
                <div key={ex.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-amber-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div><h3 className="font-semibold text-gray-900">{ex.name}</h3><div className="text-xs text-gray-400 mt-0.5">{ex.dates}</div><div className="text-xs text-gray-400">{ex.location}{ex.standNumber?` · Stand ${ex.standNumber}`:""}</div></div>
                    <span className="text-3xl font-bold text-gray-100" style={{fontFamily:"'Cormorant Garant',serif"}}>{year}</span>
                  </div>
                  <div className="flex gap-3 mb-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><UserCheck size={11}/>{ex.meetings.length}</span>
                    <span className="flex items-center gap-1"><Gift size={11}/>{totalGifts}</span>
                    {ppt>0&&<span className="flex items-center gap-1 text-violet-500"><Presentation size={11}/>{ppt} PPT</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>open(ex)} className="flex-1 text-xs bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm"><ChevronRight size={13}/>Open</button>
                    <button onClick={()=>openDup(ex)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-3 rounded-lg flex items-center gap-1"><Copy size={12}/>Dup.</button>
                    <button onClick={()=>del(ex.id)} className="text-gray-300 hover:text-red-400 px-2"><Trash2 size={14}/></button>
                  </div>
                </div>
              );
            })}</div>
          )}
        </div>
      ))}
      {byYear.length===0&&<div className="text-center py-20 text-gray-400"><Calendar size={40} className="mx-auto mb-3 text-gray-200"/><p>No exhibitions yet.</p></div>}
      {showModal&&(
        <Modal title={dupFrom?`Duplicate — ${dupFrom}`:"New Exhibition"} onClose={()=>setShowModal(false)}>
          <div className="flex flex-col gap-4">
            {dupFrom&&<div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">Duplicating from <strong>{dupFrom}</strong>. Meetings start fresh.</div>}
            <Input label="Name *" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. SBC Lisbon"/>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Year" value={form.year||""} onChange={v=>setForm(p=>({...p,year:v}))} placeholder="2026"/>
              <Input label="Our Stand #" value={form.standNumber||""} onChange={v=>setForm(p=>({...p,standNumber:v}))} placeholder="e.g. N105"/>
            </div>
            <Input label="Dates" value={form.dates||""} onChange={v=>setForm(p=>({...p,dates:v}))} placeholder="e.g. Feb 10–12, 2026"/>
            <Input label="Location" value={form.location||""} onChange={v=>setForm(p=>({...p,location:v}))} placeholder="e.g. Lisbon, Portugal"/>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={()=>setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={saveFn} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Create</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── EXHIBITION DETAIL ────────────────────────────────────────────────────────
const ExhibitionDetail=({exhibition,exhibitions,setExhibitions,contacts,companies,team,giftCats,setGiftCats,setView,onOpenSlideOut})=>{
  const [search,setSearch]=useState("");const[filterBD,setFilterBD]=useState("");const[filterDate,setFilterDate]=useState("");
  const [meetSort,setMeetSort]=useState({key:'time',dir:'asc'});const[showAdd,setShowAdd]=useState(false);const[editingId,setEditingId]=useState(null);const[mForm,setMForm]=useState({});
  const [showGiftMgr,setShowGiftMgr]=useState(false);const[newGift,setNewGift]=useState("");
  const [hEdit,setHEdit]=useState(false);const[hForm,setHForm]=useState({});
  const ex=useMemo(()=>exhibitions.find(e=>e.id===exhibition.id)||exhibition,[exhibitions,exhibition.id]);
  const updateEx=useCallback(fn=>setExhibitions(prev=>prev.map(e=>e.id===ex.id?fn(e):e)),[ex.id,setExhibitions]);
  const dates=[...new Set(ex.meetings.map(m=>m.date))].sort();
  const bdNames=team.filter(t=>t.role==="BD").map(t=>t.name);const amNames=team.filter(t=>t.role==="AM").map(t=>t.name);
  const cNames=contacts.map(c=>c.name);const coNames=companies.map(c=>c.name);
  const filteredM=useMemo(()=>{
    let ms=ex.meetings;
    if(search)ms=ms.filter(m=>[m.contactNames,m.company,m.bd,m.am,m.status,m.clientType].join(" ").toLowerCase().includes(search.toLowerCase()));
    if(filterBD)ms=ms.filter(m=>{const bd=(m.bd||"").toLowerCase();const f=filterBD.toLowerCase();return bd.includes(f);});
    if(filterDate)ms=ms.filter(m=>m.date===filterDate);
    const sk=meetSort.key;const sd=meetSort.dir;
    ms=[...ms].sort((a,b)=>{
      let av=a[sk]??'';let bv=b[sk]??'';
      if(typeof av==='boolean')av=av?'1':'0';if(typeof bv==='boolean')bv=bv?'1':'0';
      av=String(av).toLowerCase();bv=String(bv).toLowerCase();
      if(av<bv)return sd==='asc'?-1:1;if(av>bv)return sd==='asc'?1:-1;return 0;
    });
    return ms;
  },[ex.meetings,search,filterBD,filterDate,meetSort]);
  const groupedDates=[...new Set(filteredM.map(m=>m.date))];
  const newBlank=()=>({id:uid(),date:ex.meetings[0]?.date||new Date().toISOString().slice(0,10),time:"",contactNames:"",company:"",clientType:"",bd:"",am:"",meetingLocation:"Our Stand",locationDetail:ex.standNumber||"",powerpointReady:false,gifts:{},status:"",notes:""});
  const openAdd=()=>{setMForm(newBlank());setEditingId(null);setShowAdd(true);};
  const openEdit=m=>{setMForm({...m,gifts:{...(m.gifts||{})}});setEditingId(m.id);setShowAdd(true);};
  const onCSelect=n=>{const c=contacts.find(x=>x.name===n);setMForm(p=>({...p,contactNames:n,company:c?.company||p.company}));};
  const onCoSelect=n=>{const co=companies.find(x=>x.name===n);setMForm(p=>({...p,company:n,clientType:co?.clientType||p.clientType}));};
  const saveM=()=>{if(!mForm.company?.trim())return;updateEx(e=>editingId?{...e,meetings:e.meetings.map(m=>m.id===editingId?mForm:m)}:{...e,meetings:[...e.meetings,mForm]});setShowAdd(false);};
  const delM=id=>updateEx(e=>({...e,meetings:e.meetings.filter(m=>m.id!==id)}));
  const giftTotal=cat=>ex.meetings.reduce((s,m)=>s+(m.gifts?.[cat]||0),0);
  const findContact=cn=>{if(!cn)return null;const fn=cn.split(/[,\s]+/)[0].toLowerCase().trim();if(!fn||fn.length<2)return null;return contacts.find(c=>c.name.split(' ')[0].toLowerCase()===fn);};
  const ppt={ready:ex.meetings.filter(m=>m.powerpointReady).length,total:ex.meetings.length};
  return(
    <div className="p-6">
      <button onClick={()=>setView("exhibitions")} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm mb-5"><ArrowLeft size={15}/>Back to Exhibitions</button>
      <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
        <div>
          {hEdit?(
            <div className="flex flex-col gap-2">
              <Input value={hForm.name||""} onChange={v=>setHForm(p=>({...p,name:v}))} placeholder="Name"/>
              <div className="flex gap-2 flex-wrap">
                <Input value={hForm.dates||""} onChange={v=>setHForm(p=>({...p,dates:v}))} placeholder="Dates"/>
                <Input value={hForm.location||""} onChange={v=>setHForm(p=>({...p,location:v}))} placeholder="Location"/>
                <Input value={hForm.standNumber||""} onChange={v=>setHForm(p=>({...p,standNumber:v}))} placeholder="Our Stand #"/>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>{updateEx(e=>({...e,...hForm}));setHEdit(false);}} className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold">Save</button>
                <button onClick={()=>setHEdit(false)} className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg">Cancel</button>
              </div>
            </div>
          ):(
            <>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{fontFamily:"'Cormorant Garant',serif"}}>
                {ex.name} <span className="text-gray-300 font-normal">{ex.year}</span>
                <button onClick={()=>{setHForm({name:ex.name,dates:ex.dates,location:ex.location,standNumber:ex.standNumber});setHEdit(true);}} className="text-gray-300 hover:text-amber-500"><Edit2 size={14}/></button>
              </h1>
              <p className="text-gray-400 text-sm">{ex.dates} · {ex.location}{ex.standNumber?` · Our Stand: ${ex.standNumber}`:""}</p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setShowGiftMgr(true)} className="flex items-center gap-1 text-xs border border-gray-200 text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg shadow-sm"><Settings size={13}/>Gifts</button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"><Plus size={16}/>Add Meeting</button>
        </div>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[["Meetings "+ex.meetings.length,"bg-gray-50 text-gray-700 border-gray-200"],[`Companies: ${[...new Set(ex.meetings.map(m=>m.company).filter(Boolean))].length}`,"bg-blue-50 text-blue-700 border-blue-200"],[`PPT: ${ppt.ready}/${ppt.total}`,"bg-violet-50 text-violet-700 border-violet-200"],
          ...giftCats.map(g=>[`${g}: ${giftTotal(g)}`,"bg-amber-50 text-amber-700 border-amber-200"])
        ].map(([l,c],i)=><span key={i} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${c}`}>{l}</span>)}
      </div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company, contact, BD..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-amber-400 shadow-sm"/></div>
        <select value={filterBD} onChange={e=>setFilterBD(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 shadow-sm">
          <option value="">All BD</option>{bdNames.map(b=><option key={b} value={b.split(" ")[0]}>{b.split(" ")[0]}</option>)}
        </select>
        <select value={filterDate} onChange={e=>setFilterDate(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 shadow-sm">
          <option value="">All Dates</option>{dates.map(d=><option key={d} value={d}>{new Date(d+"T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</option>)}
        </select>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl overflow-auto shadow-sm">
        <table className="w-full text-xs min-w-max">
          <thead><tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider bg-gray-50">
            {[['date','Date'],['time','Time'],['contactNames','Contact(s)'],['company','Company'],['meetingLocation','Location'],['bd','BD'],['am','AM']].map(([col,lbl])=>(
              <th key={col} onClick={()=>setMeetSort(prev=>prev.key===col?{key:col,dir:prev.dir==='asc'?'desc':'asc'}:{key:col,dir:'asc'})}
                className="text-left px-3 py-3 cursor-pointer select-none whitespace-nowrap group hover:text-amber-600">
                <span className="inline-flex items-center gap-1">{lbl}
                  <span className={`text-xs ${meetSort.key===col?'text-amber-500':'text-gray-200 group-hover:text-gray-400'}`}>
                    {meetSort.key===col?(meetSort.dir==='asc'?'↑':'↓'):'↕'}
                  </span>
                </span>
              </th>
            ))}
            <th className="text-center px-3 py-3 cursor-pointer select-none group hover:text-amber-600" onClick={()=>setMeetSort(prev=>prev.key==='powerpointReady'?{key:'powerpointReady',dir:prev.dir==='asc'?'desc':'asc'}:{key:'powerpointReady',dir:'asc'})}>
              PPT<span className={`ml-1 text-xs ${meetSort.key==='powerpointReady'?'text-amber-500':'text-gray-200 group-hover:text-gray-400'}`}>{meetSort.key==='powerpointReady'?(meetSort.dir==='asc'?'↑':'↓'):'↕'}</span>
            </th>
            {giftCats.map(g=><th key={g} className="text-center px-3 py-3">{g.split(" ")[0]}</th>)}
            <th className="text-left px-3 py-3 cursor-pointer select-none group hover:text-amber-600" onClick={()=>setMeetSort(prev=>prev.key==='status'?{key:'status',dir:prev.dir==='asc'?'desc':'asc'}:{key:'status',dir:'asc'})}>
              <span className="inline-flex items-center gap-1">Status<span className={`text-xs ${meetSort.key==='status'?'text-amber-500':'text-gray-200 group-hover:text-gray-400'}`}>{meetSort.key==='status'?(meetSort.dir==='asc'?'↑':'↓'):'↕'}</span></span>
            </th>
            <th className="text-right px-3 py-3">Act.</th>
          </tr></thead>
          <tbody>
            {groupedDates.map(date=>(
              <>
                <tr key={`d-${date}`} className="bg-amber-50/50">
                  <td colSpan={9+giftCats.length+2} className="px-4 py-2">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">📅 {new Date(date+"T00:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</span>
                  </td>
                </tr>
                {filteredM.filter(m=>m.date===date).map((m,i)=>{
                  // Company-aware contact matcher: tries name+company first, falls back to name-only if unique
                  const norm=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[\s\-_.,&'()\/]/g,'');
                  const meetCo=norm(m.company);
                  const matchContact=(nameStr)=>{
                    const fn=norm(nameStr.trim().split(' ')[0]);
                    if(!fn||fn.length<2)return null;
                    // Company match required — no name-only fallback (prevents wrong cross-links)
                    if(meetCo.length>2){
                      return contacts.find(c=>{
                        if(norm(c.name.split(' ')[0])!==fn)return false;
                        const cCo=norm(c.company);
                        return cCo.length>2&&(cCo.includes(meetCo.slice(0,5))||meetCo.includes(cCo.slice(0,5)));
                      })||null;
                    }
                    return null;
                  };
                  return(
                    <tr key={m.id} className={`border-b border-gray-50 hover:bg-amber-50/20 ${i%2===1?"bg-gray-50/20":""}`}>
                      <td className="px-3 py-2.5 text-gray-500">{m.date}</td>
                      <td className="px-3 py-2.5 text-gray-600 font-mono">{m.time||<span className="text-gray-200">—</span>}</td>
                      <td className="px-3 py-2.5">
                        {m.contactNames ? (
                          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
                            {m.contactNames.split(',').map((nm,idx)=>{
                              const ct=matchContact(nm);
                              return ct?(
                                <PrefTooltip key={idx} contact={ct}>
                                  <button onClick={()=>onOpenSlideOut(ct)} className="font-medium text-amber-600 hover:underline text-xs leading-5">{nm.trim()}</button>
                                </PrefTooltip>
                              ):(
                                <span key={idx} className="font-medium text-gray-800 text-xs leading-5">{nm.trim()}</span>
                              );
                            })}
                          </div>
                        ):<span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-2.5"><div className="font-semibold text-gray-900">{m.company}</div>{m.clientType&&<div className="text-gray-400">{m.clientType}</div>}</td>
                      <td className="px-3 py-2.5"><div className="flex items-center gap-1 text-gray-600">{MLOC[m.meetingLocation]||"📍"} {m.meetingLocation}</div>{m.locationDetail&&<div className="text-gray-400 text-xs">{m.locationDetail}</div>}</td>
                      <td className="px-3 py-2.5 text-gray-500">{m.bd||<span className="text-gray-200">—</span>}</td>
                      <td className="px-3 py-2.5 text-gray-500">{m.am||<span className="text-gray-200">—</span>}</td>
                      <td className="px-3 py-2.5 text-center">{m.powerpointReady?<CheckCircle2 size={14} className="text-emerald-500 mx-auto"/>:<XCircle size={14} className="text-gray-200 mx-auto"/>}</td>
                      {giftCats.map(g=><td key={g} className="px-3 py-2.5 text-center">{m.gifts?.[g]?<span className="font-bold text-amber-600">{m.gifts[g]}</span>:<span className="text-gray-200">—</span>}</td>)}
                      <td className="px-3 py-2.5">{m.status&&<Badge label={m.status} colorClass={SC[m.status]}/>}</td>
                      <td className="px-3 py-2.5 text-right"><div className="flex items-center justify-end gap-1">
                        <button onClick={()=>openEdit(m)} className="text-gray-300 hover:text-amber-500"><Edit2 size={12}/></button>
                        <button onClick={()=>delM(m.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={12}/></button>
                      </div></td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
        {filteredM.length===0&&<div className="text-center py-14 text-gray-400"><UserCheck size={30} className="mx-auto mb-2 text-gray-200"/>No meetings found</div>}
      </div>
      {showAdd&&(
        <Modal title={editingId?"Edit Meeting":"Add Meeting"} onClose={()=>setShowAdd(false)} wide>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Date *" type="date" value={mForm.date||""} onChange={v=>setMForm(p=>({...p,date:v}))}/>
            <Input label="Time" type="time" value={mForm.time||""} onChange={v=>setMForm(p=>({...p,time:v}))}/>
            <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact(s)</label>
              <AC value={mForm.contactNames||""} onChange={v=>setMForm(p=>({...p,contactNames:v}))} onSelect={onCSelect} suggestions={cNames} placeholder="Type to search contacts..."/></div>
            <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</label>
              <AC value={mForm.company||""} onChange={v=>setMForm(p=>({...p,company:v}))} onSelect={onCoSelect} suggestions={coNames} placeholder="Type to search companies..."/></div>
            <Sel label="Client Type" value={mForm.clientType||""} onChange={v=>setMForm(p=>({...p,clientType:v}))} options={["Operator","Aggregator","Platform","Law Firm","Marketing","Other"]} placeholder="Select type"/>
            <Sel label="Meeting Location" value={mForm.meetingLocation||"Our Stand"} onChange={v=>setMForm(p=>({...p,meetingLocation:v}))} options={["Our Stand","Their Stand","Neutral","Virtual","Dinner","Media Lounge"]}/>
            <Input label="Location Detail / Stand #" value={mForm.locationDetail||""} onChange={v=>setMForm(p=>({...p,locationDetail:v}))} placeholder={ex.standNumber||"e.g. N105"}/>
            <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">BD</label>
              <AC value={mForm.bd||""} onChange={v=>setMForm(p=>({...p,bd:v}))} onSelect={v=>setMForm(p=>({...p,bd:v}))} suggestions={bdNames} placeholder="BD member(s)..."/></div>
            <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AM</label>
              <AC value={mForm.am||""} onChange={v=>setMForm(p=>({...p,am:v}))} onSelect={v=>setMForm(p=>({...p,am:v}))} suggestions={amNames} placeholder="AM member(s)..."/></div>
          </div>
          <div className="mb-4 bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-violet-700 text-sm font-medium"><Presentation size={15}/>PowerPoint Prepared</div>
            <Toggle value={mForm.powerpointReady||false} onChange={v=>setMForm(p=>({...p,powerpointReady:v}))}/>
          </div>
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Gifts Given</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{giftCats.map(g=>(
              <div key={g} className="flex flex-col gap-1"><label className="text-xs text-gray-500">{g}</label>
                <input type="number" min="0" value={mForm.gifts?.[g]||""} onChange={e=>setMForm(p=>({...p,gifts:{...(p.gifts||{}),[g]:parseInt(e.target.value)||0}}))}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-amber-400 w-full" placeholder="0"/></div>
            ))}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Sel label="Status" value={mForm.status||""} onChange={v=>setMForm(p=>({...p,status:v}))} options={["Live","Integrating","Contracting","First Contact","Contact","Pending Integration","Requesting"]} placeholder="Select status"/>
            <Input label="Notes" value={mForm.notes||""} onChange={v=>setMForm(p=>({...p,notes:v}))} placeholder="Meeting notes..."/>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={()=>setShowAdd(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={saveM} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Save</button>
          </div>
        </Modal>
      )}
      {showGiftMgr&&(
        <Modal title="Gift Categories" onClose={()=>setShowGiftMgr(false)}>
          <div className="space-y-2 mb-4">{giftCats.map(g=>(
            <div key={g} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700">{g}</span>
              <button onClick={()=>setGiftCats(prev=>prev.filter(x=>x!==g))} className="text-gray-300 hover:text-red-400"><X size={14}/></button>
            </div>
          ))}</div>
          <div className="flex gap-2">
            <input value={newGift} onChange={e=>setNewGift(e.target.value)} placeholder="Add gift category..." onKeyDown={e=>{if(e.key==="Enter"&&newGift.trim()&&!giftCats.includes(newGift.trim())){setGiftCats(p=>[...p,newGift.trim()]);setNewGift("");}}}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400"/>
            <button onClick={()=>{if(newGift.trim()&&!giftCats.includes(newGift.trim())){setGiftCats(p=>[...p,newGift.trim()]);setNewGift("");}}} className="bg-amber-500 text-white px-3 py-2 rounded-lg"><Plus size={16}/></button>
          </div>
          <div className="mt-4 flex justify-end"><button onClick={()=>setShowGiftMgr(false)} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Done</button></div>
        </Modal>
      )}
    </div>
  );
};

// ─── BUSINESS TRIPS ───────────────────────────────────────────────────────────
const BusinessTripsPage=({businessTrips,setBusinessTrips})=>{
  const [selectedTrip,setSelectedTrip]=useState(null);const[showAddTrip,setShowAddTrip]=useState(false);const[tripForm,setTripForm]=useState({});
  const [showAddLeg,setShowAddLeg]=useState(false);const[legForm,setLegForm]=useState({});const[editingLeg,setEditingLeg]=useState(null);
  const [search,setSearch]=useState("");
  const [legSort,setLegSort]=useState({key:'date',dir:'asc'});
  const toggleLegSort=k=>setLegSort(prev=>prev.key===k?{key:k,dir:prev.dir==='asc'?'desc':'asc'}:{key:k,dir:'asc'});
  const sortLegs=arr=>{if(!legSort.key)return arr;return [...arr].sort((a,b)=>{let av=String(a[legSort.key]||'').toLowerCase();let bv=String(b[legSort.key]||'').toLowerCase();if(av<bv)return legSort.dir==='asc'?-1:1;if(av>bv)return legSort.dir==='asc'?1:-1;return 0;});};
  const LTh=({col,label,center=false})=>(<th onClick={()=>toggleLegSort(col)} className={`${center?'text-center':'text-left'} px-4 py-3 cursor-pointer select-none group hover:text-amber-600 whitespace-nowrap text-xs`}><span className="inline-flex items-center gap-1">{label}<span className={`text-xs ${legSort.key===col?'text-amber-500':'text-gray-200 group-hover:text-gray-400'}`}>{legSort.key===col?(legSort.dir==='asc'?'↑':'↓'):'↕'}</span></span></th>);
  const openNewTrip=()=>{setTripForm({id:uid(),name:"",year:new Date().getFullYear(),dates:"",description:"",legs:[]});setShowAddTrip(true);};
  const saveTrip=()=>{if(!tripForm.name?.trim())return;setBusinessTrips(prev=>[...prev,tripForm]);setShowAddTrip(false);};
  const delTrip=id=>{setBusinessTrips(prev=>prev.filter(t=>t.id!==id));if(selectedTrip?.id===id)setSelectedTrip(null);};
  const trip=selectedTrip?businessTrips.find(t=>t.id===selectedTrip.id)||selectedTrip:null;
  const updateTrip=fn=>setBusinessTrips(prev=>prev.map(t=>t.id===trip.id?fn(t):t));
  const newLeg=()=>({id:uid(),date:"",city:"",client:"",contact:"",meetingType:"Meeting",time:"",gifts:"",location:"",status:"Confirmed",notes:""});
  const openAddLeg=()=>{setLegForm(newLeg());setEditingLeg(null);setShowAddLeg(true);};
  const openEditLeg=l=>{setLegForm({...l});setEditingLeg(l.id);setShowAddLeg(true);};
  const saveLeg=()=>{if(!legForm.client?.trim())return;updateTrip(t=>editingLeg?{...t,legs:t.legs.map(l=>l.id===editingLeg?legForm:l)}:{...t,legs:[...t.legs,legForm]});setShowAddLeg(false);};
  const delLeg=id=>updateTrip(t=>({...t,legs:t.legs.filter(l=>l.id!==id)}));
  const filteredLegs=trip?trip.legs.filter(l=>[l.client,l.city,l.contact,l.meetingType].join(" ").toLowerCase().includes(search.toLowerCase())):[];
  return(
    <div className="p-6">
      {!trip?(
        <>
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>Business Trips</h1><p className="text-gray-400 text-sm">{businessTrips.length} trips</p></div>
            <button onClick={openNewTrip} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"><Plus size={16}/>New Trip</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessTrips.map(bt=>{
              const cities=[...new Set(bt.legs.map(l=>l.city).filter(Boolean))];
              return(
                <div key={bt.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-amber-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div><h3 className="font-semibold text-gray-900">{bt.name}</h3><div className="text-xs text-gray-400 mt-0.5">{bt.dates}</div>{bt.description&&<div className="text-xs text-gray-400 mt-0.5">{bt.description}</div>}</div>
                    <span className="text-2xl font-bold text-gray-100" style={{fontFamily:"'Cormorant Garant',serif"}}>{bt.year}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">{cities.slice(0,4).map(city=><Badge key={city} label={city} colorClass={CITY_C[city]||"bg-gray-100 text-gray-600 border-gray-200"}/>)}</div>
                  <div className="flex gap-2">
                    <button onClick={()=>setSelectedTrip(bt)} className="flex-1 text-xs bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm"><ChevronRight size={13}/>Open ({bt.legs.length} stops)</button>
                    <button onClick={()=>delTrip(bt.id)} className="text-gray-300 hover:text-red-400 px-2"><Trash2 size={14}/></button>
                  </div>
                </div>
              );
            })}
            {businessTrips.length===0&&<div className="col-span-3 text-center py-20 text-gray-400"><Briefcase size={40} className="mx-auto mb-3 text-gray-200"/><p>No business trips yet.</p></div>}
          </div>
        </>
      ):(
        <>
          <button onClick={()=>setSelectedTrip(null)} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm mb-5"><ArrowLeft size={15}/>All Trips</button>
          <div className="flex items-center justify-between mb-5">
            <div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>{trip.name} <span className="text-gray-300 font-normal">{trip.year}</span></h1><p className="text-gray-400 text-sm">{trip.dates}</p></div>
            <button onClick={openAddLeg} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"><Plus size={16}/>Add Stop</button>
          </div>
          <div className="relative mb-4"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter by client, city, type..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-amber-400 shadow-sm"/></div>
          <div className="bg-white border border-gray-100 rounded-xl overflow-auto shadow-sm">
            <table className="w-full text-sm min-w-max">
              <thead><tr className="border-b border-gray-100 bg-gray-50 text-gray-400 uppercase tracking-wider">
                <LTh col="date" label="Date"/>
                <LTh col="time" label="Time"/>
                <LTh col="city" label="City"/>
                <LTh col="client" label="Client"/>
                <LTh col="contact" label="Contact"/>
                <LTh col="meetingType" label="Type"/>
                <LTh col="gifts" label="Gifts"/>
                <LTh col="location" label="Address"/>
                <LTh col="status" label="Status"/>
                <th className="text-right px-4 py-3 text-xs">Act.</th>
              </tr></thead>
              <tbody>
                {sortLegs(filteredLegs).map((l,i)=>(
                  <tr key={l.id} className={`border-b border-gray-50 hover:bg-amber-50/20 ${i%2===1?"bg-gray-50/20":""}`}>
                    <td className="px-4 py-2.5 text-gray-600 text-xs whitespace-nowrap">{l.date?new Date(l.date+"T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):""}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs font-mono">{l.time||<span className="text-gray-200">—</span>}</td>
                    <td className="px-4 py-2.5"><Badge label={l.city||"—"} colorClass={CITY_C[l.city]||"bg-gray-100 text-gray-600 border-gray-200"}/></td>
                    <td className="px-4 py-2.5 font-semibold text-gray-900 text-sm">{l.client}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{l.contact||<span className="text-gray-200">—</span>}</td>
                    <td className="px-4 py-2.5 text-xs"><span className="flex items-center gap-1">{MTYPE[l.meetingType]||"🤝"} {l.meetingType}</span></td>
                    <td className="px-4 py-2.5 text-xs max-w-xs">
                      {l.gifts==="X"?<span className="text-rose-500 flex items-center gap-1"><Gift size={10}/>Given</span>
                        :l.gifts?<span className="text-amber-600">{l.gifts}</span>:<span className="text-gray-200">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-400 max-w-xs truncate">{l.location||<span className="text-gray-200">—</span>}</td>
                    <td className="px-4 py-2.5"><Badge label={l.status} colorClass={SC[l.status]}/></td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={()=>openEditLeg(l)} className="text-gray-300 hover:text-amber-500"><Edit2 size={13}/></button>
                        <button onClick={()=>delLeg(l.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLegs.length===0&&<div className="text-center py-12 text-gray-400">No stops yet.</div>}
          </div>
        </>
      )}
      {showAddTrip&&(
        <Modal title="New Business Trip" onClose={()=>setShowAddTrip(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Trip Name *" value={tripForm.name||""} onChange={v=>setTripForm(p=>({...p,name:v}))} placeholder="e.g. Brazil & Latam Trip"/>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Year" value={tripForm.year||""} onChange={v=>setTripForm(p=>({...p,year:v}))} placeholder="2026"/>
              <Input label="Dates" value={tripForm.dates||""} onChange={v=>setTripForm(p=>({...p,dates:v}))} placeholder="Apr 10 – Apr 30, 2026"/>
            </div>
            <Input label="Description" value={tripForm.description||""} onChange={v=>setTripForm(p=>({...p,description:v}))} placeholder="e.g. Post-Sigma São Paulo"/>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={()=>setShowAddTrip(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={saveTrip} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Create</button>
          </div>
        </Modal>
      )}
      {showAddLeg&&(
        <Modal title={editingLeg?"Edit Stop":"Add Stop"} onClose={()=>setShowAddLeg(false)} wide>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={legForm.date||""} onChange={v=>setLegForm(p=>({...p,date:v}))}/>
            <Input label="Time" type="time" value={legForm.time||""} onChange={v=>setLegForm(p=>({...p,time:v}))}/>
            <Input label="City" value={legForm.city||""} onChange={v=>setLegForm(p=>({...p,city:v}))} placeholder="e.g. São Paulo"/>
            <Input label="Client *" value={legForm.client||""} onChange={v=>setLegForm(p=>({...p,client:v}))} placeholder="e.g. Superbet"/>
            <Input label="Contact Name" value={legForm.contact||""} onChange={v=>setLegForm(p=>({...p,contact:v}))} placeholder="e.g. Fernando Lemos"/>
            <Sel label="Type" value={legForm.meetingType||"Meeting"} onChange={v=>setLegForm(p=>({...p,meetingType:v}))} options={["Meeting","Office Visit","Dinner","Lunch"]}/>
            <Sel label="Status" value={legForm.status||"Confirmed"} onChange={v=>setLegForm(p=>({...p,status:v}))} options={["Confirmed","Confirming","Pending","Cancelled"]}/>
            <Input label="Gifts Given" value={legForm.gifts||""} onChange={v=>setLegForm(p=>({...p,gifts:v}))} placeholder="e.g. 1 JBL + 1 Stanley"/>
          </div>
          <div className="mt-3"><Input label="Address / Location" value={legForm.location||""} onChange={v=>setLegForm(p=>({...p,location:v}))} placeholder="Full address or venue name"/></div>
          <div className="mt-3"><Input label="Notes" value={legForm.notes||""} onChange={v=>setLegForm(p=>({...p,notes:v}))} placeholder="Any notes..."/></div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={()=>setShowAddLeg(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={saveLeg} className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── GIFT TRACKER ─────────────────────────────────────────────────────────────
const GiftTrackerPage=({exhibitions,businessTrips,giftCats})=>{
  const [filterEx,setFilterEx]=useState("");
  const [giftSortKey,setGiftSortKey]=useState('');const[giftSortDir,setGiftSortDir]=useState('asc');
  const [btSortKey,setBtSortKey]=useState('');const[btSortDir,setBtSortDir]=useState('asc');
  const toggleGiftSort=k=>{if(giftSortKey===k)setGiftSortDir(d=>d==='asc'?'desc':'asc');else{setGiftSortKey(k);setGiftSortDir('asc');}};
  const toggleBtSort=k=>{if(btSortKey===k)setBtSortDir(d=>d==='asc'?'desc':'asc');else{setBtSortKey(k);setBtSortDir('asc');}};
  const sortArr=(arr,k,d)=>{if(!k)return arr;return [...arr].sort((a,b)=>{let av=String(a[k]||'').toLowerCase();let bv=String(b[k]||'').toLowerCase();if(av<bv)return d==='asc'?-1:1;if(av>bv)return d==='asc'?1:-1;return 0;});};
  const rows=useMemo(()=>{const exList=filterEx?exhibitions.filter(e=>e.id===filterEx):exhibitions;const raw=exList.flatMap(ex=>ex.meetings.filter(m=>Object.values(m.gifts||{}).some(v=>v>0)).map(m=>({exName:`${ex.name} ${ex.year}`,contactNames:m.contactNames,company:m.company,gifts:m.gifts||{},status:m.status})));return sortArr(raw,giftSortKey,giftSortDir);},[exhibitions,filterEx,giftSortKey,giftSortDir]);
  const totals=useMemo(()=>{const t={};giftCats.forEach(g=>t[g]=0);rows.forEach(r=>Object.entries(r.gifts).forEach(([k,v])=>{if(t[k]!==undefined)t[k]+=v;}));return t;},[rows,giftCats]);
  const btRows=useMemo(()=>{const raw=businessTrips.flatMap(bt=>bt.legs.filter(l=>l.gifts&&l.gifts.trim()).map(l=>({trip:bt.name,date:l.date,city:l.city,client:l.client,contact:l.contact,gifts:l.gifts,type:l.meetingType,status:l.status})));return sortArr(raw,btSortKey,btSortDir);},[businessTrips,btSortKey,btSortDir]);
  return(
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Cormorant Garant',serif"}}>Gift Tracker</h1><p className="text-gray-400 text-sm">All gifts across exhibitions and business trips</p></div>
        <select value={filterEx} onChange={e=>setFilterEx(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 shadow-sm">
          <option value="">All Exhibitions</option>{exhibitions.map(e=><option key={e.id} value={e.id}>{e.name} {e.year}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {giftCats.map(g=>(
          <div key={g} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <Gift size={16} className="text-amber-500 shrink-0"/>
            <div><div className="text-xl font-bold text-amber-600">{totals[g]||0}</div><div className="text-xs text-gray-400">{g}</div></div>
          </div>
        ))}
      </div>
      <h3 className="font-semibold text-gray-700 mb-3 text-sm">Exhibition Gifts</h3>
      <div className="bg-white border border-gray-100 rounded-xl overflow-auto shadow-sm mb-6">
        <table className="w-full text-xs min-w-max">
          <thead><tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider bg-gray-50">
            {[['exName','Event'],['contactNames','Contact(s)'],['company','Company']].map(([col,lbl])=>(
              <th key={col} onClick={()=>toggleGiftSort(col)} className="text-left px-4 py-3 cursor-pointer select-none group hover:text-amber-600 whitespace-nowrap">
                <span className="inline-flex items-center gap-1">{lbl}<span className={`text-xs ${giftSortKey===col?'text-amber-500':'text-gray-200 group-hover:text-gray-400'}`}>{giftSortKey===col?(giftSortDir==='asc'?'↑':'↓'):'↕'}</span></span>
              </th>
            ))}
            {giftCats.map(g=><th key={g} className="text-center px-4 py-3">{g}</th>)}
            <th className="text-center px-4 py-3">Total</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className={`border-b border-gray-50 hover:bg-amber-50/20 ${i%2===1?"bg-gray-50/20":""}`}>
                <td className="px-4 py-2.5 text-gray-500">{r.exName}</td>
                <td className="px-4 py-2.5 text-gray-700">{r.contactNames||"—"}</td>
                <td className="px-4 py-2.5 font-medium text-gray-900">{r.company}</td>
                {giftCats.map(g=><td key={g} className="px-4 py-2.5 text-center">{r.gifts[g]?<span className="font-bold text-amber-600">{r.gifts[g]}</span>:<span className="text-gray-200">—</span>}</td>)}
                <td className="px-4 py-2.5 text-center font-bold text-gray-900">{Object.values(r.gifts).reduce((s,v)=>s+v,0)}</td>
              </tr>
            ))}
            {rows.length===0&&<tr><td colSpan={4+giftCats.length} className="text-center py-10 text-gray-400">No exhibition gifts found</td></tr>}
          </tbody>
          {rows.length>0&&<tfoot><tr className="border-t-2 border-gray-200 bg-amber-50">
            <td className="px-4 py-3 font-bold text-gray-700" colSpan={3}>TOTAL</td>
            {giftCats.map(g=><td key={g} className="px-4 py-3 text-center font-bold text-amber-600">{totals[g]||0}</td>)}
            <td className="px-4 py-3 text-center font-bold text-amber-700">{Object.values(totals).reduce((s,v)=>s+v,0)}</td>
          </tr></tfoot>}
        </table>
      </div>
      <h3 className="font-semibold text-gray-700 mb-3 text-sm">Business Trip Gifts</h3>
      <div className="bg-white border border-gray-100 rounded-xl overflow-auto shadow-sm">
        <table className="w-full text-xs min-w-max">
          <thead><tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider bg-gray-50">
            {[['trip','Trip'],['date','Date'],['city','City'],['client','Client'],['type','Type'],['gifts','Gifts'],['status','Status']].map(([col,lbl])=>(
              <th key={col} onClick={()=>toggleBtSort(col)} className="text-left px-4 py-3 cursor-pointer select-none group hover:text-amber-600 whitespace-nowrap">
                <span className="inline-flex items-center gap-1">{lbl}<span className={`text-xs ${btSortKey===col?'text-amber-500':'text-gray-200 group-hover:text-gray-400'}`}>{btSortKey===col?(btSortDir==='asc'?'↑':'↓'):'↕'}</span></span>
              </th>
            ))}
          </tr></thead>
          <tbody>
            {btRows.map((r,i)=>(
              <tr key={i} className={`border-b border-gray-50 hover:bg-amber-50/20 ${i%2===1?"bg-gray-50/20":""}`}>
                <td className="px-4 py-2.5 text-gray-500">{r.trip}</td>
                <td className="px-4 py-2.5 text-gray-500">{r.date}</td>
                <td className="px-4 py-2.5"><Badge label={r.city||"—"} colorClass={CITY_C[r.city]||"bg-gray-100 text-gray-600 border-gray-200"}/></td>
                <td className="px-4 py-2.5 font-medium text-gray-900">{r.client}</td>
                <td className="px-4 py-2.5 text-gray-500">{r.type}</td>
                <td className="px-4 py-2.5"><span className="text-amber-600 font-medium">{r.gifts==="X"?"Gift ✓":r.gifts}</span></td>
                <td className="px-4 py-2.5"><Badge label={r.status} colorClass={SC[r.status]}/></td>
              </tr>
            ))}
            {btRows.length===0&&<tr><td colSpan={7} className="text-center py-10 text-gray-400">No business trip gifts logged</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
  {id:"contacts",label:"Contacts",icon:Users},
  {id:"companies",label:"Companies",icon:Building2},
  {id:"team",label:"Team",icon:UserCheck},
  {id:"exhibitions",label:"Exhibitions",icon:Calendar},
  {id:"businessTrips",label:"Business Trips",icon:Briefcase},
  {id:"gifts",label:"Gift Tracker",icon:Gift},
];
const Sidebar=({view,setView,collapsed,setCollapsed,onExportAll,onImportAll})=>{
  const fileRef=useRef();
  return(
    <aside className={`${collapsed?"w-14":"w-52"} shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0 transition-all duration-200`}>
      <div className="px-4 py-5 border-b border-slate-800 flex items-center gap-3">
        {!collapsed&&<div><div className="text-white font-bold text-sm" style={{fontFamily:"'Cormorant Garant',serif"}}>GamingCRM</div><div className="text-slate-500 text-xs">Pro</div></div>}
        <button onClick={()=>setCollapsed(c=>!c)} className="text-slate-500 hover:text-white ml-auto"><Menu size={17}/></button>
      </div>
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setView(n.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${view===n.id||view==="exhibitionDetail"&&n.id==="exhibitions"?"bg-amber-500 text-white font-medium shadow-sm":"text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <n.icon size={16} className="shrink-0"/>{!collapsed&&<span>{n.label}</span>}
          </button>
        ))}
      </nav>
      {!collapsed&&(
        <div className="px-3 py-4 border-t border-slate-800 space-y-1.5">
          <button onClick={onExportAll} className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded hover:bg-slate-800"><Download size={13}/>Export All Data</button>
          <input ref={fileRef} type="file" accept=".json" onChange={onImportAll} className="hidden"/>
          <button onClick={()=>fileRef.current.click()} className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded hover:bg-slate-800"><Upload size={13}/>Import Data</button>
          <p className="text-xs text-slate-700 px-2 pt-1">Auto-saved locally</p>
        </div>
      )}
    </aside>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  useEffect(()=>injectFont(),[]);
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const [selectedExhibition,setSelectedExhibition]=useState(null);
  const [slideOutContact,setSlideOutContact]=useState(null);
  const [contacts,setContacts]=useState([]);const[companies,setCompanies]=useState([]);
  const [team,setTeam]=useState([]);const[exhibitions,setExhibitions]=useState([]);
  const [businessTrips,setBusinessTrips]=useState([]);const[giftCats,setGiftCats]=useState(GIFT_CATS_DEFAULT);
  useEffect(()=>{(async()=>{const[c,co,t,e,bt,g]=await Promise.all([sload(SK.contacts,ALL_CONTACTS_SEED),sload(SK.companies,COMPANIES_SEED),sload(SK.team,TEAM_SEED),sload(SK.exhibitions,EXHIBITIONS_SEED),sload(SK.businessTrips,BUSINESS_TRIPS_SEED),sload(SK.giftCats,GIFT_CATS_DEFAULT)]);setContacts(c);setCompanies(co);setTeam(t);setExhibitions(e);setBusinessTrips(bt);setGiftCats(g);setLoading(false);})();},[]);
  useEffect(()=>{if(!loading)ssave(SK.contacts,contacts);},[contacts,loading]);
  useEffect(()=>{if(!loading)ssave(SK.companies,companies);},[companies,loading]);
  useEffect(()=>{if(!loading)ssave(SK.team,team);},[team,loading]);
  useEffect(()=>{if(!loading)ssave(SK.exhibitions,exhibitions);},[exhibitions,loading]);
  useEffect(()=>{if(!loading)ssave(SK.businessTrips,businessTrips);},[businessTrips,loading]);
  useEffect(()=>{if(!loading)ssave(SK.giftCats,giftCats);},[giftCats,loading]);
  const handleExportAll=()=>{const data={contacts,companies,team,exhibitions,businessTrips,giftCats,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`gaming-crm-${new Date().toISOString().slice(0,10)}.json`;a.click();};
  const handleImportAll=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.contacts)setContacts(d.contacts);if(d.companies)setCompanies(d.companies);if(d.team)setTeam(d.team);if(d.exhibitions)setExhibitions(d.exhibitions);if(d.businessTrips)setBusinessTrips(d.businessTrips);if(d.giftCats)setGiftCats(d.giftCats);alert("✅ Data imported!");}catch{alert("❌ Invalid JSON file.");}};r.readAsText(file);e.target.value="";};
  const goView=v=>{setView(v);if(v!=="exhibitionDetail")setSelectedExhibition(null);};
  if(loading)return(<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"/><p className="text-gray-400 text-sm">Loading CRM...</p></div></div>);
  const props={contacts,setContacts,companies,setCompanies,team,setTeam,exhibitions,setExhibitions,businessTrips,setBusinessTrips,giftCats,setGiftCats};
  return(
    <div className="min-h-screen bg-gray-50 flex" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{`*{box-sizing:border-box;}::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:#f9fafb;}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px;}`}</style>
      <Sidebar view={view} setView={goView} collapsed={collapsed} setCollapsed={setCollapsed} onExportAll={handleExportAll} onImportAll={handleImportAll}/>
      <main className="flex-1 overflow-auto">
        {view==="dashboard"&&<Dashboard {...props}/>}
        {view==="contacts"&&<ContactsPage {...props} onOpenSlideOut={setSlideOutContact}/>}
        {view==="companies"&&<CompaniesPage {...props}/>}
        {view==="team"&&<TeamPage {...props}/>}
        {view==="exhibitions"&&<ExhibitionsPage {...props} setView={goView} setSelectedExhibition={setSelectedExhibition}/>}
        {view==="exhibitionDetail"&&selectedExhibition&&<ExhibitionDetail {...props} exhibition={selectedExhibition} setView={goView} onOpenSlideOut={setSlideOutContact}/>}
        {view==="businessTrips"&&<BusinessTripsPage {...props}/>}
        {view==="gifts"&&<GiftTrackerPage {...props}/>}
      </main>
      {slideOutContact&&<ContactSlideOut contact={slideOutContact} onClose={()=>setSlideOutContact(null)} setContacts={setContacts} exhibitions={exhibitions} businessTrips={businessTrips}/>}
    </div>
  );
}
