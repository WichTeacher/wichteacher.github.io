/* Beobachtungsfragen – gemeinsamer Baustein für die Labore.
   Fragen.render(ziel, liste, optionen)
     ziel:  Element oder id des Containers (class="fragen")
     liste: [{q, o:[…], r, w}]  q und o dürfen einfaches HTML enthalten, w ist reiner Text
     optionen: {name, titel, falsch}
   Fragen.laengenbericht() liefert für alle gerenderten Fragen, wie oft die richtige Antwort die längste ist. */
(function(){
  "use strict";
  const alle=[];
  function mischen(n){const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function render(ziel,liste,opt){
    opt=opt||{};
    const box=typeof ziel==="string"?document.getElementById(ziel):ziel;
    const key=opt.name||box.id||"fragen";
    const titel=opt.titel===undefined?"Beobachtungsfragen":opt.titel;
    const falsch=opt.falsch||"Noch nicht. Beobachten Sie das Modell noch einmal genau.";
    const ix=alle.findIndex(x=>x.name===key);if(ix>=0)alle[ix]={name:key,liste};else alle.push({name:key,liste});
    box.innerHTML=titel?`<h3>${titel}</h3>`:"";
    liste.forEach((f,i)=>{
      const ord=mischen(f.o.length);
      const d=document.createElement("div");d.className="frage";
      const name=`${key}-${i}`;
      d.innerHTML=`<p>${i+1}. ${f.q}</p>`+ord.map(k=>`<label><input type="radio" name="${name}" value="${k}"><span>${f.o[k]}</span></label>`).join("")+
        `<div class="row" style="margin-top:6px"><button class="btn-2" type="button">Prüfen</button></div><div class="fb" aria-live="polite"></div>`;
      const fb=d.querySelector(".fb");
      d.querySelector("button").addEventListener("click",()=>{
        const sel=d.querySelector("input:checked");
        if(!sel){fb.className="fb fb-hint";fb.textContent="Bitte wählen Sie zuerst eine Antwort.";return}
        if(+sel.value===f.r){fb.className="fb fb-ok";fb.textContent="Richtig. "+f.w}
        else{fb.className="fb fb-bad";fb.textContent=falsch}
      });
      d.addEventListener("change",()=>{fb.className="fb";fb.textContent=""});
      box.appendChild(d);
    });
  }
  function textlaenge(html){const t=document.createElement("div");t.innerHTML=html;return t.textContent.trim().length}
  function laengenbericht(){
    const fr=alle.flatMap(x=>x.liste);
    let laengste=0,kuerzeste=0;
    fr.forEach(f=>{const l=f.o.map(textlaenge);if(l[f.r]===Math.max(...l))laengste++;if(l[f.r]===Math.min(...l))kuerzeste++});
    return {fragen:fr.length,laengste,kuerzeste,anteilLaengste:fr.length?laengste/fr.length:0};
  }
  window.Fragen={render,laengenbericht};
})();
