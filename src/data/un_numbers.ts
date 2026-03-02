export interface UNNumber {
  id: string;
  name: string;
  class: string;
  description?: string;
  transportCategory: 0 | 1 | 2 | 3 | 4;
  tunnelCode?: string;
}

export const unNumbers: UNNumber[] = [
  // Class 1
  { id: '0027', name: 'KRUT, SVART', class: '1.1D', description: 'Explosiva ämnen', transportCategory: 1, tunnelCode: 'B1000C' },
  { id: '0333', name: 'FYRVERKERI', class: '1.1G', description: 'Explosiva ämnen', transportCategory: 1, tunnelCode: 'B1000C' },
  { id: '0335', name: 'FYRVERKERI', class: '1.3G', description: 'Explosiva ämnen', transportCategory: 1, tunnelCode: 'C5000D' },
  { id: '0336', name: 'FYRVERKERI', class: '1.4G', description: 'Explosiva ämnen', transportCategory: 2, tunnelCode: 'E' },
  
  // Class 2
  { id: '1001', name: 'ACETYLEN, LÖST', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1002', name: 'LUFT, KOMPRIMERAD', class: '2.2', description: 'Icke brandfarlig, icke giftig gas', transportCategory: 3, tunnelCode: 'E' },
  { id: '1005', name: 'AMMONIAK, VATTENFRI', class: '2.3', description: 'Giftig gas', transportCategory: 1, tunnelCode: 'C/D' },
  { id: '1006', name: 'ARGON, KOMPRIMERAD', class: '2.2', description: 'Icke brandfarlig, icke giftig gas', transportCategory: 3, tunnelCode: 'E' },
  { id: '1011', name: 'BUTAN', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1013', name: 'KOLDIOXID', class: '2.2', description: 'Icke brandfarlig, icke giftig gas', transportCategory: 3, tunnelCode: 'C/E' },
  { id: '1017', name: 'KLOR', class: '2.3', description: 'Giftig gas', transportCategory: 1, tunnelCode: 'C/D' },
  { id: '1038', name: 'ETYLEN, KYLD, VÄTSKEFORMIG', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1044', name: 'BRANDSLÄCKARE', class: '2.2', description: 'Icke brandfarlig, icke giftig gas', transportCategory: 3, tunnelCode: 'E' },
  { id: '1049', name: 'VÄTE, KOMPRIMERAT', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1066', name: 'KVÄVE, KOMPRIMERAT', class: '2.2', description: 'Icke brandfarlig, icke giftig gas', transportCategory: 3, tunnelCode: 'E' },
  { id: '1072', name: 'SYRE, KOMPRIMERAT', class: '2.2', description: 'Oxiderande gas', transportCategory: 3, tunnelCode: 'E' },
  { id: '1073', name: 'SYRE, KYLT, VÄTSKEFORMIGT', class: '2.2', description: 'Oxiderande gas', transportCategory: 3, tunnelCode: 'C/E' },
  { id: '1075', name: 'PETROLEUMGASER, VÄTSKEFORMIGA (LPG)', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1950', name: 'AEROSOLER (Brandfarliga)', class: '2', description: 'Gaser', transportCategory: 2, tunnelCode: 'D' },
  { id: '1965', name: 'KOLVÄTEGASBLANDNING, VÄTSKEFORMIG, N.O.S (Gasol)', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1971', name: 'NATURGAS, KOMPRIMERAD', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1972', name: 'NATURGAS, KYLD, VÄTSKEFORMIG (LNG)', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },
  { id: '1977', name: 'KVÄVE, KYLT, VÄTSKEFORMIGT', class: '2.2', description: 'Icke brandfarlig, icke giftig gas', transportCategory: 3, tunnelCode: 'C/E' },
  { id: '1978', name: 'PROPAN', class: '2.1', description: 'Brandfarlig gas', transportCategory: 2, tunnelCode: 'B/D' },

  // Class 3
  { id: '1090', name: 'ACETON', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1114', name: 'BENSEN', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1170', name: 'ETANOL (ETYLALKOHOL)', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' }, // Usually PG II
  { id: '1202', name: 'DIESELOLJA / ELDNINGSOLJA', class: '3', description: 'Brandfarlig vätska', transportCategory: 3, tunnelCode: 'D/E' },
  { id: '1203', name: 'BENSIN', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1219', name: 'ISOPROPANOL (ISOPROPYLALKOHOL)', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1223', name: 'FOTOGEN', class: '3', description: 'Brandfarlig vätska', transportCategory: 3, tunnelCode: 'D/E' },
  { id: '1230', name: 'METANOL', class: '3', description: 'Brandfarlig vätska (Giftig)', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1263', name: 'FÄRG eller FÄRGRELATERAT MATERIAL (PG II)', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1266', name: 'PARFYMPRODUKTER', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1267', name: 'RÅOLJA', class: '3', description: 'Brandfarlig vätska', transportCategory: 1, tunnelCode: 'D/E' }, // Can be 1, 2 or 3. Assuming 1 for safety or 2? Usually 2. Let's say 1 to be safe or 2.
  { id: '1268', name: 'PETROLEUMDESTILLAT, N.O.S.', class: '3', description: 'Brandfarlig vätska', transportCategory: 3, tunnelCode: 'D/E' },
  { id: '1294', name: 'TOLUEN', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1300', name: 'TERPENTINERSÄTTNING', class: '3', description: 'Brandfarlig vätska', transportCategory: 3, tunnelCode: 'D/E' },
  { id: '1307', name: 'XYLENER', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' }, // PG II or III
  { id: '1863', name: 'FLYGPLANBRÄNSLE', class: '3', description: 'Brandfarlig vätska', transportCategory: 3, tunnelCode: 'D/E' },
  { id: '1866', name: 'HARSLÖSNING', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1987', name: 'ALKOHOLER, N.O.S.', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1993', name: 'BRANDFARLIG VÄTSKA, N.O.S.', class: '3', description: 'Brandfarlig vätska', transportCategory: 3, tunnelCode: 'D/E' },
  { id: '3065', name: 'ALKOHOLHALTIGA DRYCKER', class: '3', description: 'Brandfarlig vätska', transportCategory: 3, tunnelCode: 'D/E' },
  { id: '3295', name: 'KOLVÄTEN, VÄTSKEFORMIGA, N.O.S.', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '3475', name: 'ETANOL- OCH BENSINBLANDNING', class: '3', description: 'Brandfarlig vätska', transportCategory: 2, tunnelCode: 'D/E' },

  // Class 4
  { id: '1325', name: 'BRANDFARLIGT FAST ÄMNE, ORGANISKT, N.O.S.', class: '4.1', description: 'Brandfarliga fasta ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '1334', name: 'NAFTALEN, RAFFINERAD', class: '4.1', description: 'Brandfarliga fasta ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '1350', name: 'SVAVEL', class: '4.1', description: 'Brandfarliga fasta ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '1361', name: 'KOL', class: '4.2', description: 'Självantändande ämnen', transportCategory: 4, tunnelCode: 'E' }, // Often 4 if not activated
  { id: '1381', name: 'FOSFOR, VIT eller GUL', class: '4.2', description: 'Självantändande ämnen', transportCategory: 1, tunnelCode: 'D/E' },
  { id: '1402', name: 'KALIUMKARBID', class: '4.3', description: 'Utvecklar brandfarlig gas vid kontakt med vatten', transportCategory: 1, tunnelCode: 'B/E' }, // PG I
  { id: '1428', name: 'NATRIUM', class: '4.3', description: 'Utvecklar brandfarlig gas vid kontakt med vatten', transportCategory: 1, tunnelCode: 'B/E' },
  { id: '1944', name: 'TÄNDSTICKOR, SÄKERHETS-', class: '4.1', description: 'Brandfarliga fasta ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '1945', name: 'TÄNDSTICKOR, VAX-', class: '4.1', description: 'Brandfarliga fasta ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2000', name: 'CELLULOID', class: '4.1', description: 'Brandfarliga fasta ämnen', transportCategory: 3, tunnelCode: 'E' },

  // Class 5
  { id: '1444', name: 'AMMONIUMPERSULFAT', class: '5.1', description: 'Oxiderande ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '1479', name: 'OXIDERANDE FAST ÄMNE, N.O.S.', class: '5.1', description: 'Oxiderande ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '1495', name: 'NATRIUMKLORAT', class: '5.1', description: 'Oxiderande ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '1942', name: 'AMMONIUMNITRAT', class: '5.1', description: 'Oxiderande ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2014', name: 'VÄTEPEROXID, VATTENLÖSNING', class: '5.1', description: 'Oxiderande ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '2015', name: 'VÄTEPEROXID, STABILISERAD', class: '5.1', description: 'Oxiderande ämnen', transportCategory: 1, tunnelCode: 'B/E' },
  { id: '3105', name: 'ORGANISK PEROXID TYP D, VÄTSKEFORMIG', class: '5.2', description: 'Organiska peroxider', transportCategory: 2, tunnelCode: 'D' },

  // Class 6
  { id: '1547', name: 'ANILIN', class: '6.1', description: 'Giftiga ämnen', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1564', name: 'BARIUMFÖRENING, N.O.S.', class: '6.1', description: 'Giftiga ämnen', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '1613', name: 'VÄTECYANID (BLÅSYRA)', class: '6.1', description: 'Giftiga ämnen', transportCategory: 1, tunnelCode: 'C/D' },
  { id: '1888', name: 'KLOROFORM', class: '6.1', description: 'Giftiga ämnen', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '2025', name: 'KVICKSILVERFÖRENING, FAST, N.O.S.', class: '6.1', description: 'Giftiga ämnen', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '2810', name: 'GIFTIG VÄTSKA, ORGANISK, N.O.S.', class: '6.1', description: 'Giftiga ämnen', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '2811', name: 'GIFTIGT FAST ÄMNE, ORGANISKT, N.O.S.', class: '6.1', description: 'Giftiga ämnen', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '2814', name: 'SMITTFÖRANDE ÄMNE, SOM PÅVERKAR MÄNNISKOR', class: '6.2', description: 'Smittförande ämnen', transportCategory: 0, tunnelCode: 'E' }, // Cat A
  { id: '2900', name: 'SMITTFÖRANDE ÄMNE, SOM PÅVERKAR DJUR', class: '6.2', description: 'Smittförande ämnen', transportCategory: 0, tunnelCode: 'E' }, // Cat A
  { id: '2902', name: 'BEKÄMPNINGSMEDEL, VÄTSKEFORMIGT, GIFTIGT, N.O.S.', class: '6.1', description: 'Giftiga ämnen', transportCategory: 2, tunnelCode: 'D/E' },
  { id: '3291', name: 'KLINISKT AVFALL, OSPECIFICERAT, N.O.S.', class: '6.2', description: 'Smittförande ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '3373', name: 'BIOLOGISKT ÄMNE, KATEGORI B', class: '6.2', description: 'Smittförande ämnen', transportCategory: 4, tunnelCode: 'E' }, // Often exempt or Cat 4

  // Class 7
  { id: '2911', name: 'RADIOAKTIVT ÄMNE, UNDANTAGET KOLLI', class: '7', description: 'Radioaktiva ämnen', transportCategory: 4, tunnelCode: 'E' },
  { id: '2912', name: 'RADIOAKTIVT ÄMNE, LÅG SPECIFIK AKTIVITET (LSA-I)', class: '7', description: 'Radioaktiva ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2913', name: 'RADIOAKTIVT ÄMNE, YTKONTAMINERADE FÖREMÅL (SCO-I eller SCO-II)', class: '7', description: 'Radioaktiva ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2915', name: 'RADIOAKTIVT ÄMNE, TYP A-KOLLI', class: '7', description: 'Radioaktiva ämnen', transportCategory: 2, tunnelCode: 'E' }, // Often Cat 2 or 3 depending on activity

  // Class 8
  { id: '1760', name: 'FRÄTANDE VÄTSKA, N.O.S.', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' }, // PG II
  { id: '1789', name: 'SALTSYRA', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' }, // PG II
  { id: '1791', name: 'HYPOKLORITLÖSNING', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' }, // PG II
  { id: '1805', name: 'FOSFORSYRA, LÖSNING', class: '8', description: 'Frätande ämnen', transportCategory: 3, tunnelCode: 'E' }, // PG III
  { id: '1823', name: 'NATRIUMHYDROXID, FAST (Kaustiksoda)', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '1824', name: 'NATRIUMHYDROXIDLÖSNING (Lut)', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' }, // PG II
  { id: '1830', name: 'SVAVELSYRA', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' }, // PG II
  { id: '2031', name: 'NITROSYRA (SALPETERSYRA)', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' }, // PG II
  { id: '2209', name: 'FORMALDEHYDLÖSNING', class: '8', description: 'Frätande ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2794', name: 'BATTERIER, VÅTA, FYLLDA MED SYRA', class: '8', description: 'Frätande ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2795', name: 'BATTERIER, VÅTA, FYLLDA MED ALKALI', class: '8', description: 'Frätande ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2800', name: 'BATTERIER, VÅTA, LÄCKAGESÄKRA', class: '8', description: 'Frätande ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '3264', name: 'FRÄTANDE VÄTSKA, SUR, OORGANISK, N.O.S.', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '3265', name: 'FRÄTANDE VÄTSKA, SUR, ORGANISK, N.O.S.', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '3266', name: 'FRÄTANDE VÄTSKA, BASISK, OORGANISK, N.O.S.', class: '8', description: 'Frätande ämnen', transportCategory: 2, tunnelCode: 'E' },

  // Class 9
  { id: '2211', name: 'POLYMERKULOR, EXPANDERBARA', class: '9', description: 'Övriga farliga ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '2315', name: 'POLYKLORERADE BIFENYLER, VÄTSKEFORMIGA (PCB)', class: '9', description: 'Miljöfarliga ämnen', transportCategory: 0, tunnelCode: 'D/E' }, // Often Cat 0 or 2 depending on concentration
  { id: '2990', name: 'LIVRÄDDNINGSUTRUSTNING, SJÄLVUPPBLÅSANDE', class: '9', description: 'Övriga farliga ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '3077', name: 'MILJÖFARLIGT ÄMNE, FAST, N.O.S.', class: '9', description: 'Miljöfarliga ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '3082', name: 'MILJÖFARLIGT ÄMNE, VÄTSKEFORMIGT, N.O.S.', class: '9', description: 'Miljöfarliga ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '3090', name: 'LITIUMMETALLBATTERIER', class: '9', description: 'Övriga farliga ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '3091', name: 'LITIUMMETALLBATTERIER I UTRUSTNING', class: '9', description: 'Övriga farliga ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '3245', name: 'GENETISKT MODIFIERADE MIKROORGANISMER', class: '9', description: 'Övriga farliga ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '3257', name: 'VÄTSKA MED FÖRHÖJD TEMPERATUR, N.O.S.', class: '9', description: 'Övriga farliga ämnen', transportCategory: 3, tunnelCode: 'D' },
  { id: '3258', name: 'FAST ÄMNE MED FÖRHÖJD TEMPERATUR, N.O.S.', class: '9', description: 'Övriga farliga ämnen', transportCategory: 3, tunnelCode: 'D' },
  { id: '3268', name: 'SÄKERHETSUTRUSTNING (Airbag-moduler)', class: '9', description: 'Övriga farliga ämnen', transportCategory: 3, tunnelCode: 'E' },
  { id: '3480', name: 'LITIUMJONBATTERIER', class: '9', description: 'Övriga farliga ämnen', transportCategory: 2, tunnelCode: 'E' },
  { id: '3481', name: 'LITIUMJONBATTERIER I UTRUSTNING', class: '9', description: 'Övriga farliga ämnen', transportCategory: 2, tunnelCode: 'E' },
];
