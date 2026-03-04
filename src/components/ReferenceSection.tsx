import React from 'react';
import { motion } from 'framer-motion';

export default function ReferenceSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      {/* Intro / Allmän info */}
      <section className="bg-indigo-50 border border-indigo-100 p-8 sm:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">ℹ️</div>
          Viktigt vid säkerhetskontroll
        </h3>
        <p className="text-indigo-800 leading-relaxed font-medium">
          Om det behövs av bedömningen av ditt prov (säkerhetskontroll) kan förarprövaren i samband med detta ställa en fråga om något av flera eller ett moment av de du kontrollerat under säkerhetskontrollen. Aspiranten skall kunna motivera risker förknippade med detta.
        </p>
      </section>

      {/* Däck & Hjul */}
      <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-3xl font-black text-indigo-600 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">🛞</div>
          Däck & Hjul
        </h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad har du kontrollerat på däcken?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Att det inte fastnat något mellan däcken på tvillingmontaget.</li>
              <li>Däckens lufttryck.</li>
              <li>Mönsterdjupet.</li>
              <li>Inga skador eller sprickor.</li>
              <li>Vilken typ av däck det är.</li>
              <li>Att fälgen ser bra ut samt att muttrarna sitter fast och ingen rost syns runt muttrarna.</li>
              <li>Att stänkskydden sitter fast.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Minsta tillåtna mönsterdjup på vinter- samt sommardäck?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><span className="font-bold">Vinterdäck:</span> Minst 5 mm.</li>
              <li><span className="font-bold">Sommardäck:</span> Minst 1,6 mm (yttre däck på tvillingmontage kan vara mindre så länge corden inte syns).</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför slog du med hammaren på däcken?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>För att kontrollera så att det inte är punktering (lyssnar efter att det är samma klang på däcken).</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur ser du att det är vinterdäck på bilen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Däcket måste vara märkt med alptopp (berg) / snöflinga.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">När ska man ha vinterdäck på bilen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Kravet är från <span className="font-bold">10 november till 10 april</span>.</li>
              <li>Dubbdäck får du ha från <span className="font-bold">1 oktober till 15 april</span>.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">När ska man ha sommardäck på bilen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Från <span className="font-bold">11 april till 9 november</span>.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan man använda ett sommardäck under vintertiden?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Nej.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan man använda ett vinterdäck sommartid?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Ja.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad behöver man tänka på när man har bytt däck?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Åka tillbaka till däckverkstad efter 5–10 mil och efterdra muttrarna.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad händer om det finns sten mellan däcken på tvillingmontage?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Stor risk att skada däcken och stenen/föremålet kan flyga på bilarna bakom mig.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad händer om det är för lite luft i däcket?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Däcket blir varmt och risk för explosion, slitage på sidorna, bränsleförbrukningen ökar och köregenskaper ändras.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad händer om det är för mycket luft i däcket?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Risk för explosion, slitage på däckens mitt, bränsleförbrukningen minskar och köregenskaper ändras.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur ska du montera dubbdäck?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Axelvis. Tunga lastbilar och bussar får inte använda både dubbade och odubbade däck på samma axel.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför finns det stänkskydd?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Minska stenskott och att mindre smutsvatten kommer på bilarna bakom lastbilen.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad händer om det rinner rostvatten från muttrarna?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Då är muttrarna lösa och måste dras åt.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Styrservo */}
      <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-3xl font-black text-indigo-600 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">⚙️</div>
          Styrservo
        </h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka kontroller har du gjort på styrservon?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Den svänger mjukt och ratten hugger inte.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Om ratten hugger, vad är felet?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Finns luft eller smuts i systemet.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad ska du tänka på när du byter styrservoolja?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Ska vara rätt mängd (om oljan är liten blir det luft i systemet, om oljan är mycket blir det spill från behållaren).</li>
              <li>Ingen smuts ska komma in.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Färdskrivare */}
      <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-3xl font-black text-indigo-600 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">⏱️</div>
          Färdskrivare
        </h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad har du kontrollerat på färdskrivaren?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Besiktningsdatum.</li>
              <li>Att mätarställning stämmer överens med bilens mätarställning.</li>
              <li>Att plomberingen är korrekt/kvar.</li>
              <li>Att tiden stämmer.</li>
              <li>Att det finns minst 6 pappersrullar.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur ofta ska man besiktiga färdskrivaren och var?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Vartannat år på en auktoriserad verkstad (godkänd verkstad).</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Var hittar du informationen om när färdskrivare ska besiktigas?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>På kontrollappen på B-stolpe samt remsan.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad är den röda knappen och vad är den för?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Det är färdskrivarens plombering för att stoppa fusk.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan man köra lastbilen om färdskrivare är trasig?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Ja, max en vecka men ska fixas så fort som möjligt och du måste anteckna körtid, raster, annat arbete och vila manuellt.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan man köra lastbilen om man har glömt förarkortet hemma?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Nej, samt att man åker och hämtar den med sin privata bil och inte lastbilen.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan man köra lastbilen om man har tappat bort förarkortet?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Ja, max 15 dagar och anmäla förlusten till Transportstyrelsen.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad händer om plomberingen är borta?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Körförbud.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur länge sparas infon på förarkortet?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>56 dagar bakåt plus idag.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur länge sparas infon från färdskrivare hos arbetsgivaren?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>1 år.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Symbolknappar:</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><span className="font-bold">Ratt:</span> Körtid.</li>
              <li><span className="font-bold">Hammare:</span> Annat arbete.</li>
              <li><span className="font-bold">Fyrkant:</span> Tillgänglighet.</li>
              <li><span className="font-bold">Sängen:</span> Rast och vila.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Får man köra en lastbil som har en manuell färdskrivare och du har ett förarkort men glömt den hemma?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Nej.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad behöver du göra när bilen ska på verkstad och skrivaren sätts på OUT läge?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Måste skriva ut ”remsa 24” innan jag ändrar till OUT läge och sedan när jag hämtar bilen från verkstad måste jag skriva ut en ny ”remsa 24” innan jag sätter in förarkortet.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bromssystemet */}
      <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-3xl font-black text-indigo-600 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">🛑</div>
          Bromssystemet
        </h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka kontroller har du gjort på bromsarna?</h4>
            <div className="space-y-4 pl-6">
              <div>
                <p className="font-bold text-slate-800 mb-1">På utsidan:</p>
                <ul className="list-disc pl-6 space-y-1 text-slate-600">
                  <li>Dränera lufttanken.</li>
                  <li>Lyssnar efter ”nysningen”.</li>
                  <li>Lyssnar efter pysande ljud för att kontrollera så att matardelen inte läcker.</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">På insidan:</p>
                <ul className="list-disc pl-6 space-y-1 text-slate-600">
                  <li>Täthetskontroll / 30 sekunders kontroll.</li>
                  <li>Lågtrycksindikator.</li>
                  <li>Färdbroms.</li>
                  <li>Parkeringsbroms.</li>
                  <li>Dörrbromsen (Bara för buss-eleverna).</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Berätta luftens väg i bromssystemet?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Luften tas in genom ett luftfilter, sen vidare till kompressor, luften torkas i lufttorken och sen går vidare till lufttankarna.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför dränerar man tankar?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>För att se om det kommer vatten, olja eller torr luft.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad innebär det om det kommer vatten eller olja när du dränerar?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><span className="font-bold">Vatten:</span> Filtret i lufttorken är mättat.</li>
              <li><span className="font-bold">Olja:</span> Kompressorn är sliten och släpper olja mellan kolv och cylinder.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad blir risken om det kommer vatten när du dränerar?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Vintertid när det är minusgrader finns risk för isproppar i systemet, det resulterar i att det inte kommer fram luft till färdbromscylindern och jag tappar bromsverkan.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad blir risken om det kommer olja när du dränerar tanken?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Gummipackningar förstörs, det blir dyra reparationskostnader om det inte åtgärdas med en gång.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför lyssnar man efter pysande ljud på utsidan?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Kontrollerar läckage i matardelen.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför gör man täthetskontroll?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>För att kontrollera systemet är tätt (med andra ord, inget läckage i bromssystemet).</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad behöver du göra om det är läckage när du gör täthetskontroll?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Då gör jag <span className="font-bold">utökad täthetskontroll</span>. På exakt samma sätt som täthetskontroll men med motor i gång och i tre minuter i stället för 30 sekunder.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför gör man en utökad täthetskontroll?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>För att bedöma om man kan köra till verkstad eller ringa efter bärgaren.</li>
              <li>Om trycket går upp eller står konstant kan man köra till verkstad.</li>
              <li>Om trycket sjunker då är det bärgaren.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Om du har 8 bar i lufttryck när du börjar den utökade täthetskontroll, när blir det körförbud?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Strax under 8 bar (om det sjunker).</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur mycket lufttryck ska det vara i systemet när du gör täthetskontroll?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Så mycket som möjligt (8, 9 eller 10 bar).</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilken broms håller lastbilen/bussen när lågtrycksindikatorn varnar?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Parkeringsbromsen.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilken broms håller lastbilen/bussen när spärrventilen är aktiv?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Parkeringsbromsen.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad ska du göra om lågtrycksindikatorn börjar varna under tiden du kör bilen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Stannar omedelbart på ett säkert ställe och gör en utökad täthetskontroll för att avgöra om jag kan köra till verkstad eller om det blir körförbud samt ringa bärgaren.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför kontrollerar man färdbromsen samt parkeringsbromsen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Man vill vara säker så att de båda fungerar innan man ger sig ut.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka bromsar har din lastbil/buss?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Färdbroms, parkeringsbroms samt hjälpbroms.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">När du trycker på färdbromsen vilka hjul är det som bromsar?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Alla.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">När du ansätter parkeringsbromsen vilken axel bromsar då?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Den axel som har stora bromscylindrar (två klockor). Det är oftast drivande axeln men kan vara på flera axlar.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka hjälpbromsar har din lastbil/buss?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Avgasbroms och retarder.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur fungerar avgasbromsen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Den för tillbaka avgaserna in i motorn så att kolvarna jobbar långsammare. Det ger en motorbromsning.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur fungerar retardern?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Hydrauliskt.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">För- och nackdelar med retardern?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><span className="font-bold">Fördelen:</span> Man sparar på bromsskivorna och minskar risken till att få fading (när bromsskivorna blir varma och man tappar bromseffekten).</li>
              <li><span className="font-bold">Nackdelen:</span> Vintertid när det är halt, då finns risk för sladd då retardern bromsar på bara drivande axeln.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad är det för skillnad på färdbroms och parkeringsbroms?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Färdbromsen tillsätts luft för att bromsa och parkeringsbromsen släpper man ut luft för att ansätta den.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Berätta hur färdbromsen samt parkeringsbromsen fungerar?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Så fort du trycker på bromspedalen skickas det luft genom reläventilen in i bromscylindrarna. Då trycker membranet mot tryckstången och en bromshävarm trycker i sin tur på bromsbeläggen som kommer mot bromsskivan och bromsar hjulen.</li>
              <li>När du ansätter parkeringsbromsen går luften ut ur cylindern och fjädern expanderar (blir längre). När du släpper parkeringsbromsen kommer luften in och fjädern pressas ihop (blir kortare) och bromsen lossas.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">När är det möjligt att lossa parkeringsbromsen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>När trycket i systemet är över 5,5 bar.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">När stängs spärrventilen (blockeringsventil)?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>När trycket sjunker under 4,5 bar.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför finns det en spärrventil?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>För att öka säkerheten.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilken uppgift har spärrventilen?</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Den förhindrar att lastbilen/bussen ofrivilligt kommer i rullning om föraren lossar parkeringsbromsen av misstag och går ut ur fordonet. När lufttrycket går upp och lågtrycksindikatorn stängs av så förhindrar spärrventilen att fordonet börjar rulla.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Lastsäkring */}
      <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-3xl font-black text-indigo-600 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">📦</div>
          Lastsäkring
        </h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad har du kontrollerat på lasten?</h4>
            <p className="text-slate-600 leading-relaxed">
              Jag har kontrollerat att lasten är korrekt säkrad. Fram är lasten förstängd, sidorna är förstängda. I mitten används överfallssurrning och bak används surrning. Surrningsbanden är hela och inte trasiga. Blå etikett (märkning) finns och banden är låsta.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur vet du att det är förstängt?</h4>
            <p className="text-slate-600 leading-relaxed">
              De totala öppningarna i längdriktningen är högst 15 cm och de totala öppningarna i sidled är högst 15 cm.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför har vi överfallssurrning i mitten?</h4>
            <p className="text-slate-600 leading-relaxed">
              För att lasten inte är förstängd i sidorna i mitten. Öppningarna är större än 15 cm.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan vi köra om vi inte har surrning bak?</h4>
            <p className="text-slate-600 leading-relaxed">
              Ja, eftersom vi har halkskydd (gummi) under alla IBC-behållare. Det finns ingen glidrisk bakåt.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur mycket klarar fästskenan?</h4>
            <p className="text-slate-600 leading-relaxed">
              Det framgår inte av bilden. Det står inget om hur mycket den klarar. Bilden visar att banden ska vara vinklade. Vinklade band ger mindre belastning på fästet, men det finns risk att skada väggarna.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur kan du använda fästskenan om du inte vet hur mycket den klarar?</h4>
            <p className="text-slate-600 leading-relaxed">
              Eftersom vi har halkskydd under lasten finns ingen glidrisk bakåt. Därför belastas inte fästskenan.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Grundkrav för lastsäkring</h4>
            <p className="text-slate-800 font-bold mb-2">Den lastsäkring som används ska klara minst:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>80 % framåt</li>
              <li>50 % bakåt</li>
              <li>50 % åt sidorna</li>
              <li>60 % åt sidorna om det finns tipprisk</li>
            </ul>
            <div className="mt-4">
              <p className="font-bold text-slate-800">Exempel:</p>
              <ol className="list-decimal pl-6 text-slate-600">
                <li>Framåt – bromsning</li>
                <li>Sidled – sväng</li>
                <li>Bakåt – acceleration</li>
              </ol>
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur mycket klarar flaköglan?</h4>
            <p className="text-slate-600">2000 kg.</p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka lastsäkringsmetoder finns?</h4>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>Låsning</li>
              <li>Förstängning</li>
              <li>Surrning</li>
            </ul>
            <div className="mt-4">
              <p className="font-bold text-slate-800">Exempel:</p>
              <ul className="list-disc pl-6 text-slate-600">
                <li>Låsning: container</li>
                <li>Surrning: överfallssurrning, grimma, loop-/loppsurrning och rak surrning</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vinklar</h4>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>Grimma: max 45°</li>
              <li>Överfallssurrning: 90°–75°</li>
              <li>75°–30°: dubbla antalet band</li>
              <li>Mindre än 30°: välj annan metod, t.ex. förstängning eller grimma</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad betyder:</h4>
            <ol className="list-decimal pl-6 space-y-2 text-slate-600">
              <li><span className="font-bold">LC (Lashing Capacity)</span> – bandkapacitet, t.ex. 1000 kg</li>
              <li><span className="font-bold">SHF (Standard Hand Force)</span> – handkraft vid åtdragning, ca 50 kg</li>
              <li><span className="font-bold">STF (Standard Tension Force)</span> – förspänning, t.ex. överfallssurrning i mitten som trycker IBC-tanken mot golvet med ca 200 kg</li>
              <li><span className="font-bold">Elongation</span> – töjning. Bandet töjs, stanna och efterspänn vid behov.</li>
            </ol>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan du använda bandet om den blå etiketten saknas?</h4>
            <p className="text-slate-600">Nej. Bandet kasseras och ersätts med ett nytt.</p>
          </div>
        </div>
      </section>
      {/* Funktionsfrågor CE */}
      <section className="bg-white border border-slate-200 p-8 sm:p-10 rounded-[2.5rem] shadow-sm">
        <h3 className="text-3xl font-black text-indigo-600 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">🚛</div>
          Funktionsfrågor CE
        </h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-black text-slate-900 mb-3">Beskriv hur färdbromsen fungerar på släpet?</h4>
            <p className="text-slate-600 leading-relaxed">
              När bromspedalen blir nedtryckt ansätts släpets färdbroms. Släpvagnens färdbromssystem har samma funktion som lastbilen.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur fungerar katastrofbromsen?</h4>
            <p className="text-slate-600 leading-relaxed">
              Om släpet kopplas bort eller lufttrycket sjunker under 4-5 bar, bromsas alla hjul automatiskt.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad är en rangerventil?</h4>
            <p className="text-slate-600 leading-relaxed">
              En ventil (svart knapp) som tömmer färdbromssystemet på luft så att boggin kan flyttas.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad är en brysselventil?</h4>
            <p className="text-slate-600 leading-relaxed">
              Samlingsnamn på reglagen för släpets bromssystem (både rangerventil och parkeringsbroms).
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur fungerar parkeringsbromsen på släpet?</h4>
            <p className="text-slate-600 leading-relaxed">
              Ansätts genom att fjädern trycks ut och luften trycks ur. Lossas genom att fjädern pressas ihop och luft kommer in.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur kontrollerar du P-bromsen på släpet?</h4>
            <p className="text-slate-600 leading-relaxed">
              Låt släpets P-broms vara utdragen (röd knapp), starta bilen, lossa bilens P-broms och försök åka framåt.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur kontrollerar du färdbromsen på släpet?</h4>
            <p className="text-slate-600 leading-relaxed">
              Lossa P-bromsen, rulla sakta framåt och bromsa hårt med färdbromsen på lastbilen. Släpet ska stanna.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Varför finns katastrofbromsen?</h4>
            <p className="text-slate-600 leading-relaxed">
              För att stanna släpet om det lossnar från bilen eller om matarledningen går sönder.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka funktioner har de två slangarna (Duomatic) och elkontakterna mellan lastbil och släp?</h4>
            <p className="text-slate-600 leading-relaxed">
              Slangarna (matar- & manöverledning) överför luft och bromssignaler. Elkontakterna ger belysning och ABS/EBS-funktion.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka grundkrav finns det för att få koppla ihop en lastbil och släp?</h4>
            <p className="text-slate-600 leading-relaxed">
              Släpvagnsvikten, Dimension, Frigång mellan fordonen, Dragstångsvinkeln, Prestanda.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur stort glapp får det max vara mellan kopplingsbult och öglan?</h4>
            <p className="text-slate-600 leading-relaxed">
              Max 5 mm.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur kontrollerar du slitaget på kopplingsbulten och dragstångsöglan?</h4>
            <p className="text-slate-600 leading-relaxed">
              Du använder dig av en kopplingstolk.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur kontrollerar du att bygelkopplingen är låst?</h4>
            <p className="text-slate-600 leading-relaxed">
              Rulla sakta framåt och kolla att släpet följer med, samt att kopplingsbulten är nere och signalstiftet är inne.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Högsta tillåtna bruttovikt för ett fordonståg på en väg som ej är skyltad med en BK-klass?</h4>
            <p className="text-slate-600 leading-relaxed">
              64 ton.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Högsta tillåtna vikt för fordonståget på en BK2 och en BK3 väg?</h4>
            <p className="text-slate-600 leading-relaxed">
              BK2: 51,4 ton, BK3: 37,5 ton.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vad är största mellanrummet för att lasten skall räknas som förstängd?</h4>
            <p className="text-slate-600 leading-relaxed">
              15 cm eller en lastpall stående på högkant.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur ska du lastsäkra en trälåda på flaket som väger 3 ton på ett golv som är av plywood?</h4>
            <p className="text-slate-600 leading-relaxed">
              Grimma fram och bak och en överfallssurrning.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Om du skall lastsäkra rullande gods, hur stor del av rullradien ska förstängas (framåt, bakåt, sidan)?</h4>
            <p className="text-slate-600 leading-relaxed">
              Sidan: klossar max 20cm och 1/3 av radien. Framåt/bakåt: Loopsurrning och förstängning.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Kan du använda TYAs lathund för lastsäkring? Vilka värden på spännbanden är till för uträkningen?</h4>
            <p className="text-slate-600 leading-relaxed">
              Ja. Värdena är LC 1600, SHF 50, STF 400 daN.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilken friktionskofficient skall du räkna med om du inte kan hitta något värde i lathunden för lastsäkring?</h4>
            <p className="text-slate-600 leading-relaxed">
              0.2.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilka krav är det på däcken på släpet (mönsterdjup)?</h4>
            <p className="text-slate-600 leading-relaxed">
              Sommar: minst 1,6 mm. Vinter: minst 1,6 mm.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur många bultar i vändkretsen får sitta löst?</h4>
            <p className="text-slate-600 leading-relaxed">
              Ingen bult får sitta löst.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Vilken axel på släpet ska man klossa vid parkering?</h4>
            <p className="text-slate-600 leading-relaxed">
              3:e eller 4:e axeln (beroende på antal). Aldrig framaxlar eller stödaxel.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur gör du för att parkera släpet säkert?</h4>
            <p className="text-slate-600 leading-relaxed">
              Klossa rätt axel, lägg i parkeringsbromsen och töm tankarna på luft.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Sitter det lufttankar på släpet?</h4>
            <p className="text-slate-600 leading-relaxed">
              Ja.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Måste det finnas parkeringsbroms på släpet om det finns fyra eller fler stoppklossar?</h4>
            <p className="text-slate-600 leading-relaxed">
              Ja, det måste finnas en parkeringsbroms.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">När räknas axlar som boggi respektive trippelaxel?</h4>
            <p className="text-slate-600 leading-relaxed">
              Boggi: &lt; 2m mellan axlarna. Trippelaxel: &lt; 5m mellan första och sista axeln.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Hur stort glapp får det vara i dragstångsfästet?</h4>
            <p className="text-slate-600 leading-relaxed">
              Max 5 mm.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-3">Får du måla om dragstången?</h4>
            <p className="text-slate-600 leading-relaxed">
              Ja, så länge du inte döljer en skada.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
