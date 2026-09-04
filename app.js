const questions=[
['આપણે શ્વાસ લેવા માટે કયો વાયુ જરૂરી છે?','ઓક્સિજન'],
['સૂર્ય કઈ દિશામાં ઉગે છે?','પૂર્વ'],
['આપણા શરીરમાં લોહી પંપ કરતું અંગ કયું છે?','હૃદય'],
['છોડને વૃદ્ધિ માટે મુખ્યત્વે શું જરૂરી છે?','પાણી'],
['વરસાદનું પાણી ક્યાંથી આવે છે?','વાદળો'],
['આપણા દેશનું નામ શું છે?','ભારત'],
['ભારતનું રાષ્ટ્રીય પ્રાણી કયું છે?','વાઘ'],
['ભારતનું રાષ્ટ્રીય પક્ષી કયું છે?','મોર'],
['ભારતનું રાષ્ટ્રીય ફૂલ કયું છે?','કમળ'],
['ભારતનું રાષ્ટ્રીય વૃક્ષ કયું છે?','વડ'],
['એક અઠવાડિયામાં કેટલા દિવસ હોય છે?','7'],
['એક વર્ષમાં કેટલા મહિના હોય છે?','12'],
['પૃથ્વીનો ઉપગ્રહ કયો છે?','ચંદ્ર'],
['પાણીનું ઘન સ્વરૂપ શું કહેવાય?','બરફ'],
['સૂર્ય આપણને શું આપે છે?','પ્રકાશ અને ગરમી'],
['કચરો ક્યાં નાખવો જોઈએ?','કચરાપેટીમાં'],
['દૂધ આપણને કયા પ્રાણીમાંથી મળે છે?','ગાય'],
['મધ કોણ બનાવે છે?','મધમાખી'],
['ઝાડ આપણને કયો વાયુ આપે છે?','ઓક્સિજન'],
['શાળામાં ભણાવનાર વ્યક્તિને શું કહેવાય?','શિક્ષક']
];

const form=document.getElementById('form');

questions.forEach((x,i)=>{
    const d=document.createElement('div');
    d.className='question';
    d.innerHTML=`
        <div class="question-title">
            પ્રશ્ન ${i+1}. ${x[0]}
        </div>
        <input class="answer"
               id="q${i}"
               placeholder="જવાબ લખો">
    `;
    form.appendChild(d);
});

document.getElementById('submit').onclick=async()=>{
    const name=document.getElementById('name').value.trim();

    if(!name){
        alert('કૃપા કરીને વિદ્યાર્થીનું નામ લખો.');
        return;
    }

    let score=0;
    let answers=[];

    questions.forEach((x,i)=>{
        const v=document.getElementById(`q${i}`).value.trim();
        answers.push(v);

        const el=document.getElementById(`q${i}`).parentElement;

        if(v===x[1]){
            score++;
            el.classList.add('correct');
        }else{
            el.classList.add('wrong');
        }
    });

    const r=document.getElementById('result');

    r.classList.remove('hidden');

    r.innerHTML=`
        🎉 <b>${name}</b>, સરસ પ્રયત્ન!
        <div class="score">${score} / ${questions.length}</div>
        સાચા જવાબ: ${score}
        &nbsp; | &nbsp;
        ખોટા: ${questions.length-score}
    `;

    await save(name,score,answers);
};

async function save(name,score,answers){

    if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
        document.getElementById('status').textContent=
        'Demo Mode: Database હજુ જોડાયેલું નથી.';
        return;
    }

    try{

        const res=await fetch(
            `${SUPABASE_URL}/rest/v1/worksheet_results`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'apikey':SUPABASE_ANON_KEY,
                    'Authorization':`Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer':'return=minimal'
                },
                body:JSON.stringify({
                    student_name:name,
                    standard:'3',
                    worksheet:'Environment and General Knowledge Worksheet 02',
                    score,
                    total:questions.length,
                    answers
                })
            }
        );

        if(!res.ok) throw Error();

        document.getElementById('status').textContent=
        '✓ પરિણામ સફળતાપૂર્વક સાચવાયું.';

    }catch(e){

        document.getElementById('status').textContent=
        'પરિણામ દેખાય છે, પરંતુ databaseમાં save થઈ શક્યું નથી.';
    }
}
