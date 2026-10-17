export interface MunicipalityItem {
  nameEn: string;
  nameNe: string;
}

export interface DistrictItem {
  nameEn: string;
  nameNe: string;
  municipalities: MunicipalityItem[];
}

export interface ProvinceItem {
  nameEn: string;
  nameNe: string;
  districts: Record<string, DistrictItem>;
}

export const NEPAL_ADMIN_DATA: Record<string, ProvinceItem> = {
  koshi: {
    nameEn: 'Koshi Province (Province 1)',
    nameNe: 'कोशी प्रदेश (प्रदेश नं. १)',
    districts: {
      jhapa: {
        nameEn: 'Jhapa',
        nameNe: 'झापा',
        municipalities: [
          { nameEn: 'Birtamod Municipality', nameNe: 'बिर्तामोड नगरपालिका' },
          { nameEn: 'Damak Municipality', nameNe: 'दमक नगरपालिका' },
          { nameEn: 'Bhadrapur Municipality', nameNe: 'भद्रपुर नगरपालिका' },
          { nameEn: 'Mechinagar Municipality', nameNe: 'मेचीनगर नगरपालिका' },
          { nameEn: 'Kankai Municipality', nameNe: 'कन्काई नगरपालिका' }
        ]
      },
      morang: {
        nameEn: 'Morang',
        nameNe: 'मोरङ',
        municipalities: [
          { nameEn: 'Biratnagar Metropolitan', nameNe: 'विराटनगर महानगरपालिका' },
          { nameEn: 'Sundarharaicha Municipality', nameNe: 'सुन्दरहरैँचा नगरपालिका' },
          { nameEn: 'Belbari Municipality', nameNe: 'बेलबारी नगरपालिका' },
          { nameEn: 'Urlabari Municipality', nameNe: 'उर्लाबारी नगरपालिका' }
        ]
      },
      sunsari: {
        nameEn: 'Sunsari',
        nameNe: 'सुनसरी',
        municipalities: [
          { nameEn: 'Dharan Sub-Metropolitan', nameNe: 'धरान उपमहानगरपालिका' },
          { nameEn: 'Itahari Sub-Metropolitan', nameNe: 'इटहरी उपमहानगरपालिका' },
          { nameEn: 'Inaruwa Municipality', nameNe: 'इनरुवा नगरपालिका' }
        ]
      },
      ilam: {
        nameEn: 'Ilam',
        nameNe: 'इलाम',
        municipalities: [
          { nameEn: 'Ilam Municipality', nameNe: 'इलाम नगरपालिका' },
          { nameEn: 'Suryodaya Municipality', nameNe: 'सूर्योदय नगरपालिका' }
        ]
      },
      panchthar: {
        nameEn: 'Panchthar',
        nameNe: 'पाँचथर',
        municipalities: [
          { nameEn: 'Phidim Municipality', nameNe: 'फिदिम नगरपालिका' }
        ]
      },
      taplejung: {
        nameEn: 'Taplejung',
        nameNe: 'ताप्लेजुङ',
        municipalities: [
          { nameEn: 'Phungling Municipality', nameNe: 'फुङलिङ नगरपालिका' }
        ]
      },
      dhankuta: {
        nameEn: 'Dhankuta',
        nameNe: 'धनकुटा',
        municipalities: [
          { nameEn: 'Dhankuta Municipality', nameNe: 'धनकुटा नगरपालिका' },
          { nameEn: 'Pakhribas Municipality', nameNe: 'पाख्रीबास नगरपालिका' }
        ]
      },
      terhathum: {
        nameEn: 'Terhathum',
        nameNe: 'तेह्रथुम',
        municipalities: [
          { nameEn: 'Myanglung Municipality', nameNe: 'म्याङलुङ नगरपालिका' }
        ]
      },
      sankhuwasabha: {
        nameEn: 'Sankhuwasabha',
        nameNe: 'सङ्खुवासभा',
        municipalities: [
          { nameEn: 'Khandbari Municipality', nameNe: 'खाँदबारी नगरपालिका' },
          { nameEn: 'Chainpur Municipality', nameNe: 'चैनपुर नगरपालिका' }
        ]
      },
      bhojpur: {
        nameEn: 'Bhojpur',
        nameNe: 'भोजपुर',
        municipalities: [
          { nameEn: 'Bhojpur Municipality', nameNe: 'भोजपुर नगरपालिका' },
          { nameEn: 'Shadanand Municipality', nameNe: 'षडानन्द नगरपालिका' }
        ]
      },
      solukhumbu: {
        nameEn: 'Solukhumbu',
        nameNe: 'सोलुखुम्बु',
        municipalities: [
          { nameEn: 'Solududhkunda Municipality', nameNe: 'सोलुदुधकुण्ड नगरपालिका' }
        ]
      },
      okhaldhunga: {
        nameEn: 'Okhaldhunga',
        nameNe: 'ओखलढुङ्गा',
        municipalities: [
          { nameEn: 'Siddhicharan Municipality', nameNe: 'सिद्धिचरण नगरपालिका' }
        ]
      },
      khotang: {
        nameEn: 'Khotang',
        nameNe: 'खोटाङ',
        municipalities: [
          { nameEn: 'Diktel Rupakot Majhuwagadhi', nameNe: 'दिक्तेल रुपाकोट मझुवागढी नगरपालिका' },
          { nameEn: 'Halesi Tuwachung Municipality', nameNe: 'हलेसी तुवाचुङ नगरपालिका' }
        ]
      },
      udayapur: {
        nameEn: 'Udayapur',
        nameNe: 'उदयपुर',
        municipalities: [
          { nameEn: 'Triyuga Municipality (Gaighat)', nameNe: 'त्रियुगा नगरपालिका (गाईघाट)' },
          { nameEn: 'Katari Municipality', nameNe: 'कटारी नगरपालिका' },
          { nameEn: 'Chaudandigadhi Municipality', nameNe: 'चौदण्डीगढी नगरपालिका' }
        ]
      }
    }
  },
  madhesh: {
    nameEn: 'Madhesh Province (Province 2)',
    nameNe: 'मधेश प्रदेश (प्रदेश नं. २)',
    districts: {
      saptari: {
        nameEn: 'Saptari',
        nameNe: 'सप्तरी',
        municipalities: [
          { nameEn: 'Rajbiraj Municipality', nameNe: 'राजविराज नगरपालिका' },
          { nameEn: 'Kanchanrup Municipality', nameNe: 'कञ्चनरूप नगरपालिका' },
          { nameEn: 'Khadak Municipality', nameNe: 'खडक नगरपालिका' },
          { nameEn: 'Bodebarsain Municipality', nameNe: 'बोदेबरसाइन नगरपालिका' }
        ]
      },
      siraha: {
        nameEn: 'Siraha',
        nameNe: 'सिराहा',
        municipalities: [
          { nameEn: 'Golbazar Municipality', nameNe: 'गोलबजार नगरपालिका' },
          { nameEn: 'Lahan Municipality', nameNe: 'लहान नगरपालिका' },
          { nameEn: 'Siraha Municipality', nameNe: 'सिराहा नगरपालिका' },
          { nameEn: 'Mirchaiya Municipality', nameNe: 'मिर्चैया नगरपालिका' },
          { nameEn: 'Sukhipur Municipality', nameNe: 'सुखीपुर नगरपालिका' },
          { nameEn: 'Dhangadhimai Municipality', nameNe: 'धनगढीमाई नगरपालिका' }
        ]
      },
      dhanusha: {
        nameEn: 'Dhanusha',
        nameNe: 'धनुषा',
        municipalities: [
          { nameEn: 'Janakpurdham Sub-Metropolitan', nameNe: 'जनकपुरधाम उपमहानगरपालिका' },
          { nameEn: 'Mithila Municipality (Dhalkebar)', nameNe: 'मिथिला नगरपालिका (ढल्केबर)' },
          { nameEn: 'Chhireswarnath Municipality', nameNe: 'छिरेश्वरनाथ नगरपालिका' },
          { nameEn: 'Dhanusadham Municipality', nameNe: 'धनुषाधाम नगरपालिका' }
        ]
      },
      mahottari: {
        nameEn: 'Mahottari',
        nameNe: 'महोत्तरी',
        municipalities: [
          { nameEn: 'Jaleshwor Municipality', nameNe: 'जलेश्वर नगरपालिका' },
          { nameEn: 'Bardibas Municipality', nameNe: 'बर्दिबास नगरपालिका' },
          { nameEn: 'Gaushala Municipality', nameNe: 'गौशाला नगरपालिका' }
        ]
      },
      sarlahi: {
        nameEn: 'Sarlahi',
        nameNe: 'सर्लाही',
        municipalities: [
          { nameEn: 'Malangwa Municipality', nameNe: 'मलंगवा नगरपालिका' },
          { nameEn: 'Lalbandi Municipality', nameNe: 'लालबन्दी नगरपालिका' },
          { nameEn: 'Harion Municipality', nameNe: 'हरिवन नगरपालिका' },
          { nameEn: 'Barahathwa Municipality', nameNe: 'बरहथवा नगरपालिका' }
        ]
      },
      rautahat: {
        nameEn: 'Rautahat',
        nameNe: 'रौतहट',
        municipalities: [
          { nameEn: 'Gaur Municipality', nameNe: 'गौर नगरपालिका' },
          { nameEn: 'Chandrapur Municipality (Chapur)', nameNe: 'चन्द्रपुर नगरपालिका (चन्द्रनिगाहपुर)' },
          { nameEn: 'Garuda Municipality', nameNe: 'गरुडा नगरपालिका' },
          { nameEn: 'Brindaban Municipality', nameNe: 'वृन्दावन नगरपालिका' }
        ]
      },
      bara: {
        nameEn: 'Bara',
        nameNe: 'बारा',
        municipalities: [
          { nameEn: 'Kalaiya Sub-Metropolitan', nameNe: 'कलैया उपमहानगरपालिका' },
          { nameEn: 'Jeetpur Simara Sub-Metropolitan', nameNe: 'जीतपुर सिमरा उपमहानगरपालिका' },
          { nameEn: 'Nijgadh Municipality', nameNe: 'निजगढ नगरपालिका' },
          { nameEn: 'Kolhabi Municipality', nameNe: 'कोल्हवी नगरपालिका' }
        ]
      },
      parsa: {
        nameEn: 'Parsa',
        nameNe: 'पर्सा',
        municipalities: [
          { nameEn: 'Birgunj Metropolitan', nameNe: 'वीरगञ्ज महानगरपालिका' },
          { nameEn: 'Pokhariya Municipality', nameNe: 'पोखरिया नगरपालिका' },
          { nameEn: 'Parsagadhi Municipality', nameNe: 'पर्सागढी नगरपालिका' }
        ]
      }
    }
  },
  bagmati: {
    nameEn: 'Bagmati Province (Kathmandu / Chitwan)',
    nameNe: 'बागमती प्रदेश (काठमाडौं / चितवन)',
    districts: {
      kathmandu: {
        nameEn: 'Kathmandu',
        nameNe: 'काठमाडौं',
        municipalities: [
          { nameEn: 'Kathmandu Metropolitan', nameNe: 'काठमाडौं महानगरपालिका' },
          { nameEn: 'Budhanilkantha Municipality', nameNe: 'बूढानीलकण्ठ नगरपालिका' },
          { nameEn: 'Kirtipur Municipality', nameNe: 'कीर्तिपुर नगरपालिका' },
          { nameEn: 'Chandragiri Municipality', nameNe: 'चन्द्रागिरी नगरपालिका' },
          { nameEn: 'Tokha Municipality', nameNe: 'टोखा नगरपालिका' },
          { nameEn: 'Tarakeshwar Municipality', nameNe: 'तारकेश्वर नगरपालिका' }
        ]
      },
      lalitpur: {
        nameEn: 'Lalitpur',
        nameNe: 'ललितपुर',
        municipalities: [
          { nameEn: 'Lalitpur Metropolitan', nameNe: 'ललितपुर महानगरपालिका' },
          { nameEn: 'Mahalaxmi Municipality', nameNe: 'महालक्ष्मी नगरपालिका' },
          { nameEn: 'Godawari Municipality', nameNe: 'गोदावरी नगरपालिका' }
        ]
      },
      bhaktapur: {
        nameEn: 'Bhaktapur',
        nameNe: 'भक्तपुर',
        municipalities: [
          { nameEn: 'Bhaktapur Municipality', nameNe: 'भक्तपुर नगरपालिका' },
          { nameEn: 'Madhyapur Thimi Municipality', nameNe: 'मध्यपुर थिमी नगरपालिका' },
          { nameEn: 'Suryabinayak Municipality', nameNe: 'सूर्यविनायक नगरपालिका' },
          { nameEn: 'Changunarayan Municipality', nameNe: 'चाँगुनारायण नगरपालिका' }
        ]
      },
      chitwan: {
        nameEn: 'Chitwan',
        nameNe: 'चितवन',
        municipalities: [
          { nameEn: 'Bharatpur Metropolitan', nameNe: 'भरतपुर महानगरपालिका' },
          { nameEn: 'Ratnanagar Municipality', nameNe: 'रत्ननगर नगरपालिका' },
          { nameEn: 'Khairahani Municipality', nameNe: 'खैरहनी नगरपालिका' },
          { nameEn: 'Rapti Municipality', nameNe: 'राप्ती नगरपालिका' }
        ]
      },
      makwanpur: {
        nameEn: 'Makwanpur',
        nameNe: 'मकवानपुर',
        municipalities: [
          { nameEn: 'Hetauda Sub-Metropolitan', nameNe: 'हेटौंडा उपमहानगरपालिका' },
          { nameEn: 'Thaha Municipality', nameNe: 'थाहा नगरपालिका' }
        ]
      },
      kavrepalanchok: {
        nameEn: 'Kavrepalanchok',
        nameNe: 'काभ्रेपलाञ्चोक',
        municipalities: [
          { nameEn: 'Banepa Municipality', nameNe: 'बनेपा नगरपालिका' },
          { nameEn: 'Dhulikhel Municipality', nameNe: 'धुलिखेल नगरपालिका' },
          { nameEn: 'Panauti Municipality', nameNe: 'पनौती नगरपालिका' }
        ]
      },
      sindhupalchok: {
        nameEn: 'Sindhupalchok',
        nameNe: 'सिन्धुपाल्चोक',
        municipalities: [
          { nameEn: 'Chautara Sangachokgadhi', nameNe: 'चौतारा साँगाचोकगढी नगरपालिका' },
          { nameEn: 'Melamchi Municipality', nameNe: 'मेलम्ची नगरपालिका' }
        ]
      },
      dolakha: {
        nameEn: 'Dolakha',
        nameNe: 'दोलखा',
        municipalities: [
          { nameEn: 'Bhimeshwar Municipality (Charikot)', nameNe: 'भीमेश्वर नगरपालिका (चरिकोट)' },
          { nameEn: 'Jiri Municipality', nameNe: 'जिरी नगरपालिका' }
        ]
      },
      ramechhap: {
        nameEn: 'Ramechhap',
        nameNe: 'रामेछाप',
        municipalities: [
          { nameEn: 'Manthali Municipality', nameNe: 'मन्थली नगरपालिका' },
          { nameEn: 'Ramechhap Municipality', nameNe: 'रामेछाप नगरपालिका' }
        ]
      },
      sindhuli: {
        nameEn: 'Sindhuli',
        nameNe: 'सिन्धुली',
        municipalities: [
          { nameEn: 'Kamalamai Municipality (Sindhulimadi)', nameNe: 'कमलामाई नगरपालिका (सिन्धुलीमाढी)' },
          { nameEn: 'Dudhouli Municipality', nameNe: 'दुधौली नगरपालिका' }
        ]
      },
      nuwakot: {
        nameEn: 'Nuwakot',
        nameNe: 'नुवाकोट',
        municipalities: [
          { nameEn: 'Bidur Municipality', nameNe: 'विदुर नगरपालिका' },
          { nameEn: 'Belkotgadhi Municipality', nameNe: 'बेलकोटगढी नगरपालिका' }
        ]
      },
      rasuwa: {
        nameEn: 'Rasuwa',
        nameNe: 'रसुवा',
        municipalities: [
          { nameEn: 'Uttargaya Rural Municipality', nameNe: 'उत्तरगया गाउँपालिका' },
          { nameEn: 'Gosainkunda Rural Municipality', nameNe: 'गोसाइँकुण्ड गाउँपालिका' }
        ]
      },
      dhading: {
        nameEn: 'Dhading',
        nameNe: 'धादिङ',
        municipalities: [
          { nameEn: 'Nilkantha Municipality (Dhading Besi)', nameNe: 'नीलकण्ठ नगरपालिका (धादिङबेसी)' },
          { nameEn: 'Dhunibeshi Municipality', nameNe: 'धुनीबेँसी नगरपालिका' }
        ]
      }
    }
  },
  gandaki: {
    nameEn: 'Gandaki Province (Pokhara)',
    nameNe: 'गण्डकी प्रदेश (पोखरा)',
    districts: {
      kaski: {
        nameEn: 'Kaski',
        nameNe: 'कास्की',
        municipalities: [
          { nameEn: 'Pokhara Metropolitan', nameNe: 'पोखरा महानगरपालिका' }
        ]
      },
      tanahun: {
        nameEn: 'Tanahun',
        nameNe: 'तनहुँ',
        municipalities: [
          { nameEn: 'Byas Municipality (Damauli)', nameNe: 'व्यास नगरपालिका (दमौली)' },
          { nameEn: 'Shuklagandaki Municipality', nameNe: 'शुक्लागण्डकी नगरपालिका' }
        ]
      },
      gorkha: {
        nameEn: 'Gorkha',
        nameNe: 'गोरखा',
        municipalities: [
          { nameEn: 'Gorkha Municipality', nameNe: 'गोरखा नगरपालिका' },
          { nameEn: 'Palungtar Municipality', nameNe: 'पालुङटार नगरपालिका' }
        ]
      },
      lamjung: {
        nameEn: 'Lamjung',
        nameNe: 'लमजुङ',
        municipalities: [
          { nameEn: 'Besishahar Municipality', nameNe: 'बेसीशहर नगरपालिका' },
          { nameEn: 'Sundarbazar Municipality', nameNe: 'सुन्दरबजार नगरपालिका' }
        ]
      },
      syangja: {
        nameEn: 'Syangja',
        nameNe: 'स्याङ्जा',
        municipalities: [
          { nameEn: 'Putalibazar Municipality', nameNe: 'पुतलीबजार नगरपालिका' },
          { nameEn: 'Waling Municipality', nameNe: 'वालिङ नगरपालिका' }
        ]
      },
      nawalpur: {
        nameEn: 'Nawalpur (Nawalparasi East)',
        nameNe: 'नवलपुर (नवलपरासी पूर्व)',
        municipalities: [
          { nameEn: 'Kawasoti Municipality', nameNe: 'कावासोती नगरपालिका' },
          { nameEn: 'Gaindakot Municipality', nameNe: 'गैँडाकोट नगरपालिका' },
          { nameEn: 'Devchuli Municipality', nameNe: 'देवचुली नगरपालिका' }
        ]
      },
      parbat: {
        nameEn: 'Parbat',
        nameNe: 'पर्वत',
        municipalities: [
          { nameEn: 'Kushma Municipality', nameNe: 'कुश्मा नगरपालिका' },
          { nameEn: 'Phalebas Municipality', nameNe: 'फलेवास नगरपालिका' }
        ]
      },
      baglung: {
        nameEn: 'Baglung',
        nameNe: 'बागलुङ',
        municipalities: [
          { nameEn: 'Baglung Municipality', nameNe: 'बागलुङ नगरपालिका' },
          { nameEn: 'Galkot Municipality', nameNe: 'गलकोट नगरपालिका' },
          { nameEn: 'Dhorpatan Municipality', nameNe: 'ढोरपाटन नगरपालिका' }
        ]
      },
      myagdi: {
        nameEn: 'Myagdi',
        nameNe: 'म्याग्दी',
        municipalities: [
          { nameEn: 'Beni Municipality', nameNe: 'बेनी नगरपालिका' }
        ]
      },
      mustang: {
        nameEn: 'Mustang',
        nameNe: 'मुस्ताङ',
        municipalities: [
          { nameEn: 'Gharapjhong Rural Muni (Jomsom)', nameNe: 'घरपझोङ गाउँपालिका (जोमसोम)' }
        ]
      },
      manang: {
        nameEn: 'Manang',
        nameNe: 'मनाङ',
        municipalities: [
          { nameEn: 'Chame Rural Municipality', nameNe: 'चामे गाउँपालिका' }
        ]
      }
    }
  },
  lumbini: {
    nameEn: 'Lumbini Province (Butwal / Bhairahawa)',
    nameNe: 'लुम्बिनी प्रदेश (बुटवल / भैरहवा)',
    districts: {
      rupandehi: {
        nameEn: 'Rupandehi',
        nameNe: 'रुपन्देही',
        municipalities: [
          { nameEn: 'Butwal Sub-Metropolitan', nameNe: 'बुटवल उपमहानगरपालिका' },
          { nameEn: 'Siddharthanagar (Bhairahawa)', nameNe: 'सिद्धार्थनगर नगरपालिका (भैरहवा)' },
          { nameEn: 'Tilottama Municipality', nameNe: 'तिलोत्तमा नगरपालिका' },
          { nameEn: 'Sainamaina Municipality', nameNe: 'सैनामैना नगरपालिका' }
        ]
      },
      kapilvastu: {
        nameEn: 'Kapilvastu',
        nameNe: 'कपिलवस्तु',
        municipalities: [
          { nameEn: 'Kapilvastu Municipality (Taulihawa)', nameNe: 'कपिलवस्तु नगरपालिका (तौलिहवा)' },
          { nameEn: 'Banganga Municipality', nameNe: 'बाणगंगा नगरपालिका' },
          { nameEn: 'Shivaraj Municipality', nameNe: 'शिवराज नगरपालिका' }
        ]
      },
      parasi: {
        nameEn: 'Parasi (Nawalparasi West)',
        nameNe: 'परासी (नवलपरासी पश्चिम)',
        municipalities: [
          { nameEn: 'Ramgram Municipality (Parasi)', nameNe: 'रामग्राम नगरपालिका (परासी)' },
          { nameEn: 'Sunwal Municipality', nameNe: 'सुनवल नगरपालिका' },
          { nameEn: 'Bardaghat Municipality', nameNe: 'बर्दघाट नगरपालिका' }
        ]
      },
      palpa: {
        nameEn: 'Palpa',
        nameNe: 'पाल्पा',
        municipalities: [
          { nameEn: 'Tansen Municipality', nameNe: 'तानसेन नगरपालिका' },
          { nameEn: 'Rampur Municipality', nameNe: 'रामपुर नगरपालिका' }
        ]
      },
      gulmi: {
        nameEn: 'Gulmi',
        nameNe: 'गुल्मी',
        municipalities: [
          { nameEn: 'Resunga Municipality (Tamghas)', nameNe: 'रेसुङ्गा नगरपालिका (तमघास)' },
          { nameEn: 'Musikot Municipality', nameNe: 'मुसिकोट नगरपालिका' }
        ]
      },
      arghakhanchi: {
        nameEn: 'Arghakhanchi',
        nameNe: 'अर्घाखाँची',
        municipalities: [
          { nameEn: 'Sandhikharka Municipality', nameNe: 'सन्धिखर्क नगरपालिका' },
          { nameEn: 'Sitganga Municipality', nameNe: 'सितगंगा नगरपालिका' }
        ]
      },
      dang: {
        nameEn: 'Dang',
        nameNe: 'दाङ',
        municipalities: [
          { nameEn: 'Ghorahi Sub-Metropolitan', nameNe: 'घोराही उपमहानगरपालिका' },
          { nameEn: 'Tulsipur Sub-Metropolitan', nameNe: 'तुलसीपुर उपमहानगरपालिका' },
          { nameEn: 'Lamahi Municipality', nameNe: 'लम्ही नगरपालिका' }
        ]
      },
      banke: {
        nameEn: 'Banke',
        nameNe: 'बाँके',
        municipalities: [
          { nameEn: 'Nepalgunj Sub-Metropolitan', nameNe: 'नेपालगञ्ज उपमहानगरपालिका' },
          { nameEn: 'Kohalpur Municipality', nameNe: 'कोहलपुर नगरपालिका' }
        ]
      },
      bardiya: {
        nameEn: 'Bardiya',
        nameNe: 'बर्दिया',
        municipalities: [
          { nameEn: 'Gulariya Municipality', nameNe: 'गुलरिया नगरपालिका' },
          { nameEn: 'Bansgadhi Municipality', nameNe: 'बाँसगढी नगरपालिका' },
          { nameEn: 'Barbardiya Municipality', nameNe: 'बारबर्दिया नगरपालिका' }
        ]
      },
      pyuthan: {
        nameEn: 'Pyuthan',
        nameNe: 'प्युठान',
        municipalities: [
          { nameEn: 'Pyuthan Municipality', nameNe: 'प्युठान नगरपालिका' },
          { nameEn: 'Swargadwari Municipality', nameNe: 'स्वर्गद्वारी नगरपालिका' }
        ]
      },
      rolpa: {
        nameEn: 'Rolpa',
        nameNe: 'रोल्पा',
        municipalities: [
          { nameEn: 'Rolpa Municipality (Liwang)', nameNe: 'रोल्पा नगरपालिका (लिवाङ)' }
        ]
      },
      eastern_rukum: {
        nameEn: 'Eastern Rukum',
        nameNe: 'पूर्वी रुकुम',
        municipalities: [
          { nameEn: 'Rukumkot / Sisne Rural Muni', nameNe: 'सिस्ने गाउँपालिका (रुकुमकोट)' }
        ]
      }
    }
  },
  karnali: {
    nameEn: 'Karnali Province (Surkhet)',
    nameNe: 'कर्णाली प्रदेश (सुर्खेत)',
    districts: {
      surkhet: {
        nameEn: 'Surkhet',
        nameNe: 'सुर्खेत',
        municipalities: [
          { nameEn: 'Birendranagar Municipality', nameNe: 'वीरेन्द्रनगर नगरपालिका' },
          { nameEn: 'Bheriganga Municipality', nameNe: 'भेरीगंगा नगरपालिका' },
          { nameEn: 'Gurbhakot Municipality', nameNe: 'गुर्भाकोट नगरपालिका' }
        ]
      },
      dailekh: {
        nameEn: 'Dailekh',
        nameNe: 'दैलेख',
        municipalities: [
          { nameEn: 'Narayan Municipality', nameNe: 'नारायण नगरपालिका' },
          { nameEn: 'Dullu Municipality', nameNe: 'दुल्लु नगरपालिका' }
        ]
      },
      salyan: {
        nameEn: 'Salyan',
        nameNe: 'सल्यान',
        municipalities: [
          { nameEn: 'Sharada Municipality (Khalanga)', nameNe: 'शारदा नगरपालिका (खलंगा)' },
          { nameEn: 'Bagchaur Municipality', nameNe: 'बागचौर नगरपालिका' }
        ]
      },
      western_rukum: {
        nameEn: 'Western Rukum',
        nameNe: 'पश्चिम रुकुम',
        municipalities: [
          { nameEn: 'Musikot Municipality', nameNe: 'मुसिकोट नगरपालिका' },
          { nameEn: 'Chaurjahari Municipality', nameNe: 'चौरजहारी नगरपालिका' }
        ]
      },
      jajarkot: {
        nameEn: 'Jajarkot',
        nameNe: 'जाजरकोट',
        municipalities: [
          { nameEn: 'Bheri Municipality (Khalanga)', nameNe: 'भेरी नगरपालिका (खलंगा)' },
          { nameEn: 'Chhedagad Municipality', nameNe: 'छेडागाड नगरपालिका' }
        ]
      },
      jumla: {
        nameEn: 'Jumla',
        nameNe: 'जुम्ला',
        municipalities: [
          { nameEn: 'Chandannath Municipality', nameNe: 'चन्दननाथ नगरपालिका' }
        ]
      },
      kalikot: {
        nameEn: 'Kalikot',
        nameNe: 'कालिकोट',
        municipalities: [
          { nameEn: 'Khandachakra Municipality (Manma)', nameNe: 'खाँडाचक्र नगरपालिका (मान्म)' },
          { nameEn: 'Raskot Municipality', nameNe: 'रासकोट नगरपालिका' }
        ]
      },
      mugu: {
        nameEn: 'Mugu',
        nameNe: 'मुगु',
        municipalities: [
          { nameEn: 'Chhayanath Rara Municipality', nameNe: 'छायाँनाथ रारा नगरपालिका' }
        ]
      },
      humla: {
        nameEn: 'Humla',
        nameNe: 'हुम्ला',
        municipalities: [
          { nameEn: 'Simkot Rural Municipality', nameNe: 'सिमकोट गाउँपालिका' }
        ]
      },
      dolpa: {
        nameEn: 'Dolpa',
        nameNe: 'डोल्पा',
        municipalities: [
          { nameEn: 'Thuli Bheri Municipality (Dunai)', nameNe: 'ठूली भेरी नगरपालिका (दुने)' },
          { nameEn: 'Tripurasundari Municipality', nameNe: 'त्रिपुरासुन्दरी नगरपालिका' }
        ]
      }
    }
  },
  sudurpashchim: {
    nameEn: 'Sudurpashchim Province (Dhangadhi)',
    nameNe: 'सुदूरपश्चिम प्रदेश (धनगढी)',
    districts: {
      kailali: {
        nameEn: 'Kailali',
        nameNe: 'कैलाली',
        municipalities: [
          { nameEn: 'Dhangadhi Sub-Metropolitan', nameNe: 'धनगढी उपमहानगरपालिका' },
          { nameEn: 'Tikapur Municipality', nameNe: 'टीकापुर नगरपालिका' },
          { nameEn: 'Godawari Municipality (Attariya)', nameNe: 'गोदावरी नगरपालिका (अत्तरिया)' },
          { nameEn: 'Lamki Chuha Municipality', nameNe: 'लम्की चुहा नगरपालिका' },
          { nameEn: 'Ghodaghodi Municipality', nameNe: 'घोडाघोडी नगरपालिका' }
        ]
      },
      kanchanpur: {
        nameEn: 'Kanchanpur',
        nameNe: 'कञ्चनपुर',
        municipalities: [
          { nameEn: 'Bhimdatta Municipality (Mahendranagar)', nameNe: 'भीमदत्त नगरपालिका (महेन्द्रनगर)' },
          { nameEn: 'Bedkot Municipality', nameNe: 'वेदकोट नगरपालिका' },
          { nameEn: 'Shuklaphanta Municipality', nameNe: 'शुक्लाफाँटा नगरपालिका' },
          { nameEn: 'Punarbas Municipality', nameNe: 'पुनर्वास नगरपालिका' }
        ]
      },
      doti: {
        nameEn: 'Doti',
        nameNe: 'डोटी',
        municipalities: [
          { nameEn: 'Dipayal Silgadhi Municipality', nameNe: 'दिपायल सिलगढी नगरपालिका' },
          { nameEn: 'Shikhar Municipality', nameNe: 'शिखर नगरपालिका' }
        ]
      },
      achham: {
        nameEn: 'Achham',
        nameNe: 'अछाम',
        municipalities: [
          { nameEn: 'Mangalsen Municipality', nameNe: 'मंगलसेन नगरपालिका' },
          { nameEn: 'Sanfebagar Municipality', nameNe: 'साँफेबगर नगरपालिका' },
          { nameEn: 'Kamalbazar Municipality', nameNe: 'कमलबजार नगरपालिका' }
        ]
      },
      bajhang: {
        nameEn: 'Bajhang',
        nameNe: 'बझाङ',
        municipalities: [
          { nameEn: 'Jayaprithvi Municipality (Chainpur)', nameNe: 'जयपृथ्वी नगरपालिका (चैनपुर)' },
          { nameEn: 'Bungal Municipality', nameNe: 'बुंगल नगरपालिका' }
        ]
      },
      bajura: {
        nameEn: 'Bajura',
        nameNe: 'बाजुरा',
        municipalities: [
          { nameEn: 'Badimalika Municipality (Martadi)', nameNe: 'बडीमालिका नगरपालिका (मार्तडी)' },
          { nameEn: 'Budhiganga Municipality', nameNe: 'बुढीगंगा नगरपालिका' }
        ]
      },
      dadeldhura: {
        nameEn: 'Dadeldhura',
        nameNe: 'डडेल्धुरा',
        municipalities: [
          { nameEn: 'Amargadhi Municipality', nameNe: 'अमरगढी नगरपालिका' },
          { nameEn: 'Parshuram Municipality', nameNe: 'परशुराम नगरपालिका' }
        ]
      },
      baitadi: {
        nameEn: 'Baitadi',
        nameNe: 'बैतडी',
        municipalities: [
          { nameEn: 'Dasharathchand Municipality', nameNe: 'दशरथचन्द नगरपालिका' },
          { nameEn: 'Patan Municipality', nameNe: 'पाटन नगरपालिका' },
          { nameEn: 'Melauli Municipality', nameNe: 'मेलौली नगरपालिका' }
        ]
      },
      darchula: {
        nameEn: 'Darchula',
        nameNe: 'दार्चुला',
        municipalities: [
          { nameEn: 'Mahakali Municipality (Khalanga)', nameNe: 'महाकाली नगरपालिका (खलंगा)' },
          { nameEn: 'Shailyashikhar Municipality', nameNe: 'शैल्यशिखर नगरपालिका' }
        ]
      }
    }
  }
};