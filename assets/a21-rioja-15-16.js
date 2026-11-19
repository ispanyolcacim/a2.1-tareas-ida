// Each cloze marker contains the single word to be written.
const RIOJA_TRACKS = [
  {
    title: 'Descubriendo Marqués de Riscal',
    audio: 2441025243,
    transcript: `Es un día de verano muy soleado. A mis amigos y a mí nos encanta la [[enología]], y hemos decidido explorar La Rioja en España. En primer lugar, vamos a descubrir la Rioja Alavesa. Entre risas y entusiasmo, nos dirigimos hacia las Bodegas Marqués de Riscal para probar sus vinos de alta [[calidad]] y admirar su arquitectura [[emblemática]].

Después de un viaje largo por carretera, por fin llegamos a Elciego y al hotel. Sí, en las bodegas también hay [[alojamiento]]. ¡Qué construcción! Parece una obra de arte moderna en medio de un cuento de hadas. Frank Gehry diseñó este edificio, y mezcló la magia del vino con una visión [[futurista]] en 2006.

Esta tarde, tenemos una visita a los viñedos. Vamos a escuchar atentamente las historias de los [[viticultores]] locales sobre el cultivo de variedades de uva distintas que cultivan en estas tierras.

Después de la visita a los viñedos, vamos a ir a una sala de [[degustación]] para brindar con una copa de vino. De este modo, podemos sentir la conexión con siglos de tradición [[vinícola]] y disfrutar del fruto del trabajo artesanal de varias generaciones.

Al final de la tarde, vamos a ver el atardecer con un cielo de tonos dorados y anaranjados. Más tarde, bajo el cielo [[estrellado]], vamos a compartir nuestras impresiones del día y decidir nuestra actividad para mañana. ¡Hay tantas opciones! Podemos disfrutar de una sesión de spa con tratamientos a base de vino, o explorar pueblos alaveses y riojanos pintorescos como Haro, Laguardia y Briones, [[sobrevolar]] en globo la región, etc. ¡Qué emocionante!`,
    questions: [
      {
        prompt: '¿Qué quieren hacer los viajeros en las Bodegas Marqués de Riscal?',
        answer: 0,
        options: [
          ['Probar sus vinos y admirar su arquitectura.', 'İlk paragrafta iki amaç açıkça sayılıyor. «Probar» şarapları tatmak, «admirar» ise mimariyi hayranlıkla incelemek anlamına geliyor.'],
          ['Comprarle uvas al dueño del hotel.', 'Gezginler daha sonra üzüm çeşitleri hakkında bilgi edineceklerini söylüyorlar. Üzüm satın almaktan söz edilmiyor.'],
          ['Reservar un vuelo para llegar a Elciego.', 'Elciego’ya karayoluyla gidiyorlar. Balon yolculuğu ertesi gün için sayılan olasılıklardan biri.'],
          ['Participar en la construcción de una bodega.', 'Gezginler mevcut binanın mimarisini görmeye gidiyor. İnşaata katılacakları söylenmiyor.']
        ]
      },
      {
        prompt: '¿Qué tiene de especial el edificio diseñado por Frank Gehry?',
        answer: 2,
        options: [
          ['Se construyó para almacenar globos.', 'Balon, ertesi gün için düşünülen bir etkinlik. Binanın balon depolamak için tasarlandığı söylenmiyor.'],
          ['Es una construcción medieval que se conserva intacta.', 'Binanın masal ortamına benzetilmesi, yapının Orta Çağ’dan kaldığı anlamına gelmiyor. Tasarımın modern olduğu belirtiliyor.'],
          ['Combina el mundo del vino con una visión futurista.', 'Anlatıcı, Gehry’nin 2006’da şarabın dünyasını geleceğe dönük bir mimari anlayışla birleştirdiğini söylüyor.'],
          ['Está dedicado únicamente a exposiciones de pintura.', 'Bina bir sanat eserine benzetiliyor. Ayrıca şaraphanede konaklama imkânı olduğu açıkça belirtiliyor.']
        ]
      },
      {
        prompt: '¿De qué van a hablar los viticultores locales?',
        answer: 1,
        options: [
          ['De la historia de la construcción del hotel.', 'Otelin tasarımından önceki paragrafta bahsediliyor. Bağ ziyaretinin konusu üzüm yetiştiriciliği.'],
          ['Del cultivo de distintas variedades de uva de la zona.', '«Viticultores» bağcılardır. Onlar bu topraklarda hangi farklı üzüm çeşitlerinin yetiştirildiğini ve nasıl yetiştirildiğini anlatacaklar.'],
          ['De los precios de las habitaciones en verano.', 'Otelin varlığından söz ediliyor ama konaklama fiyatlarıyla ilgili bilgi verilmiyor.'],
          ['De las mejores rutas para viajar en globo.', 'Balon, ziyaretin sonunda önerilen etkinliklerden biri. Bağcıların bu güzergâhları anlatacağı söylenmiyor.']
        ]
      },
      {
        prompt: '¿Adónde van a ir inmediatamente después de la visita a los viñedos?',
        answer: 3,
        options: [
          ['A Haro para recorrer el pueblo.', 'Haro, ertesi gün için sayılan gezi seçeneklerinden biri. Bağ ziyaretinin hemen sonrasındaki durak değil.'],
          ['A un spa para recibir un tratamiento.', 'Spa aynı şekilde ertesi günün olası etkinliklerinden biri olarak sunuluyor.'],
          ['A la terraza para decidir la actividad del día siguiente.', 'Ertesi günü konuşmak için daha geç bir saat bekliyorlar. Sorudaki «inmediatamente» ilk sonraki adımı soruyor.'],
          ['A una sala de degustación para brindar.', '«Después de la visita a los viñedos» sıralamayı doğrudan veriyor. Bir sonraki durak, kadeh kaldıracakları tadım salonu.']
        ]
      },
      {
        prompt: '¿Qué actividad se menciona como una posibilidad para el día siguiente?',
        answer: 0,
        options: [
          ['Sobrevolar la región en globo.', 'Son paragrafta, bölgenin üzerinde balonla uçmak ertesi güne ait seçeneklerden biri. Anlatıcı henüz bir seçim yaptıklarını söylemiyor.'],
          ['Volver a casa antes del amanecer.', 'Ertesi günü bölgede geçirmek için etkinlik bakıyorlar. Erken dönüş planından söz edilmiyor.'],
          ['Diseñar un edificio con Frank Gehry.', 'Gehry, mevcut binanın mimarı olarak anılıyor. Gezginlerle ortak bir çalışma planlanmıyor.'],
          ['Cultivar sus propias uvas.', 'Bağcıları dinleyecekler ama kendileri üzüm yetiştirmeyi planlamıyorlar.']
        ]
      }
    ]
  },
  {
    title: 'Un viaje inolvidable en globo',
    audio: 2441025351,
    transcript: `La noche avanza y el cielo estrellado sobre La Rioja es simplemente [[mágico]]. Nos reunimos en la [[terraza]] del hotel, con una copa de vino en la mano, para compartir nuestras experiencias del día. Pensamos que la visita a la bodega y a los viñedos fue muy divertida.

En ese momento, alguien [[sugiere]] un recorrido en globo sobre los viñedos al amanecer. Todos estamos de acuerdo; es una buena idea para el segundo día de nuestra aventura enológica. [[Rápidamente]], hacemos la [[reserva]]. Va a ser muy emocionante volar sobre los campos de uvas y los pueblos en esta región vitivinícola.

Al amanecer, vamos al punto de encuentro. Allí nos reciben los pilotos expertos y un globo muy [[colorido]] para explorar los cielos. Las vistas desde arriba son verdaderamente impresionantes, los campos de uvas forman una extensión enorme y los pueblos antiguos parecen [[maquetas]]. El paisaje es una mezcla de colores y formas. ¡Nos encanta!

En el aire, los pilotos comparten con nosotros su [[conocimiento]] sobre la región y su historia vinícola. Aprendemos sobre las uvas y cómo los productores de vino hacen este producto. El vino de La Rioja es famoso en todo el mundo.

Después de un tiempo corto, el piloto desciende [[suavemente]] el globo hacia tierra. El aterrizaje es suave y seguro, y todos aplaudimos emocionados. Acabamos de vivir una experiencia [[increíble]]. Sin duda, es un momento único en nuestro viaje enológico a La Rioja.`,
    questions: [
      {
        prompt: '¿Dónde están cuando surge la idea de viajar en globo?',
        answer: 1,
        options: [
          ['En el punto de encuentro con los pilotos.', 'Pilotlarla ancak ertesi gün, gün doğumunda buluşuyorlar. Fikir daha önce ortaya çıkıyor.'],
          ['En la terraza del hotel, hablando de su día.', 'Akşam otelin terasında günün deneyimlerini paylaşıyorlar. «En ese momento» balon fikrinin tam bu sohbet sırasında ortaya çıktığını gösteriyor.'],
          ['Dentro de la bodega, durante la degustación.', 'Şaraphane ziyaretini terasta hatırlıyorlar. Öneri, tadım sırasında yapılmıyor.'],
          ['En un pueblo antiguo, al terminar el vuelo.', 'Eski köyleri havadan görüyorlar. Öneri ise uçuş henüz yapılmadan önce geliyor.']
        ]
      },
      {
        prompt: '¿A qué hora del día se propone hacer el vuelo?',
        answer: 3,
        options: [
          ['A mediodía.', 'Metin uçuş için öğlen saatini vermiyor. Öneride güneşin doğma zamanı belirtiliyor.'],
          ['Al caer la tarde.', '«Al caer la tarde» akşamüstünü ifade eder. Burada önerilen saat sabahın erken vakti.'],
          ['Por la noche, justo después de reservar.', 'Rezervasyon gece yapılıyor. Rezervasyonun yapıldığı zaman ile uçuşun saati farklı.'],
          ['Al amanecer.', '«Al amanecer» gün doğumunda demek. Hem öneride hem de pilotlarla buluşma anında bu ifade kullanılıyor.']
        ]
      },
      {
        prompt: '¿A qué se parecen los pueblos antiguos vistos desde el globo?',
        answer: 2,
        options: [
          ['A castillos enormes.', '«Enorme» sözcüğü üzüm tarlalarının genişliğini anlatıyor. Köylerin büyük kalelere benzediği söylenmiyor.'],
          ['A nubes de muchos colores.', 'Renkler manzarayı betimliyor. Köylerin bulutlara benzetildiği bir cümle yok.'],
          ['A maquetas.', '«Los pueblos antiguos parecen maquetas» ifadesi, yükseklik nedeniyle köylerin küçük ölçekli modeller gibi göründüğünü anlatıyor.'],
          ['A campos de uvas.', 'Üzüm tarlaları ve köyler havadan ayrı ayrı görülen iki unsur. Köyler tarlalara benzetilmiyor.']
        ]
      },
      {
        prompt: '¿Qué hacen los pilotos mientras están en el aire?',
        answer: 0,
        options: [
          ['Comparten lo que saben de la región y de su historia vinícola.', 'Pilotlar bölge ve şarapçılık tarihi hakkında bildiklerini paylaşıyorlar. Yolcular bağlar ve şarabın üretimi hakkında öğreniyor.'],
          ['Enseñan a los viajeros a pilotar el globo.', 'Ballonu uzman pilotlar yönetiyor. Yolculara uçuş eğitimi verildiği söylenmiyor.'],
          ['Reparten copas de vino a todos.', 'Şarap kadehi otel terasında geçiyor. Pilotların havada şarap dağıttığından bahsedilmiyor.'],
          ['Organizan la reserva para el día siguiente.', 'Rezervasyonu yolcular bir önceki gece yapıyor. Bu, uçuş sırasında yapılan bir şey değil.']
        ]
      },
      {
        prompt: '¿Cómo termina la experiencia?',
        answer: 1,
        options: [
          ['El globo aterriza de forma brusca y los viajeros se asustan.', 'İniş «suave y seguro» olarak anlatılıyor. Yolcular korkmak yerine heyecanla alkışlıyorlar.'],
          ['El globo baja suavemente y los viajeros aplauden.', 'Pilot balonu yavaşça indiriyor ve güvenli inişin ardından yolcular alkışlıyor. «Aplaudimos» anlatıcıyı da kapsıyor.'],
          ['El piloto deja a los viajeros en una bodega para una cata.', 'Uçuş güvenli bir inişle bitiyor. Bir şaraphaneye inildiği ya da tadım yapıldığı söylenmiyor.'],
          ['El grupo cancela el vuelo al ver el tamaño del globo.', 'Grup uçuşu tamamlıyor. Son paragraf yaşadıkları deneyimi değerlendiriyor.']
        ]
      }
    ]
  },
  {
    title: 'Explorando tesoros ocultos',
    audio: 2441025882,
    transcript: `Hoy hemos explorado una [[joya]] arquitectónica de La Rioja. No es demasiado conocida, pero es un tesoro: el Monasterio de Santa María de San Salvador de Cañas. Este monasterio, con su arquitectura [[gótica]] impresionante y una historia de siglos atrás, recuerda la influencia de la cultura y la religión en la tradición del vino de la región.

En los pasillos del monasterio, reflexionamos sobre cómo la fe y la pasión por el vino han sido dos [[pilares]] fundamentales en la vida de las personas en este lugar. La Rioja no es solo famosa por su vino, sino también por su historia fascinante y su conexión con la [[espiritualidad]].

Después de nuestra visita al monasterio, fuimos a una bodega boutique. Ahí conocimos a un enólogo apasionado y nos ofreció una cata de vinos exclusivos. Aprendimos a apreciar sus [[matices]] y sabores, y profundizamos en la magia del vino riojano.

Por la tarde, visitamos un pueblo pintoresco, Cuzcurrita de Río Tirón. Allí descubrimos una bodega [[subterránea]] en funcionamiento durante generaciones. Descendimos a las profundidades de la tierra y exploramos sus cavas misteriosas. El vino envejece [[lentamente]] en ellas, ¡es fascinante! Fue un viaje en el tiempo a través de barricas y botellas, y sentimos respeto por esta tradición.

Cuando salimos de la bodega, fuimos a un restaurante en Cañas para disfrutar de una cena tradicional. De entrante, pedimos unas patatas a la riojana. Este es un plato clásico de patatas cocidas con chorizo, pimiento rojo, cebolla y [[pimentón]]. De plato principal, elegimos cordero asado al horno con ajo y hierbas aromáticas, ¡qué delicioso! Y de postre, una tarta de queso cremosa con una capa de [[mermelada]] de frutas.

Después de la cena, volvimos contentos al hotel. Mañana nos vamos a despedir de La Rioja con mucho [[agradecimiento]] y gratitud hacia esta tierra de vinos y belleza. Nuestra aventura enológica ha sido una experiencia única, y siempre vamos a llevar un pedacito de La Rioja en nuestros corazones.`,
    questions: [
      {
        prompt: '¿Qué relación destaca el narrador al visitar el monasterio?',
        answer: 2,
        options: [
          ['La relación entre la cocina local y el turismo en globo.', 'Yemek ve balon gezi boyunca farklı yerlerde geçiyor. Manastırdaki düşüncenin konusu bunlar değil.'],
          ['La influencia de Frank Gehry en la arquitectura gótica.', 'Frank Gehry ilk kayıttaki modern otelle ilgili. Manastırdaki gotik mimarinin ona ait olduğu söylenmiyor.'],
          ['La influencia de la cultura y la religión en la tradición vinícola.', 'Manastır, bölgedeki şarap geleneğinde kültür ve dinin etkisini hatırlatıyor. Anlatıcı, inanç ve şarap tutkusunu iki temel unsur olarak anıyor.'],
          ['El origen de una competición entre varios monasterios.', 'Metinde manastırlar arasında bir yarışmadan söz edilmiyor.']
        ]
      },
      {
        prompt: '¿Qué les ofreció el enólogo de la bodega boutique?',
        answer: 0,
        options: [
          ['Una cata de vinos exclusivos.', 'Manastır ziyaretinin ardından tanıştıkları şarap uzmanı özel şarapların tadımını sunuyor. Böylece şarabın tatlarındaki nüansları tanımayı öğreniyorlar.'],
          ['Una cena con platos típicos de Cañas.', 'Yöresel akşam yemeği daha sonra, bir restoranda yeniyor. Şarap uzmanının sunduğu etkinlik tadım.'],
          ['Una visita guiada al monasterio.', 'Manastırı, şarap uzmanıyla tanışmadan önce ziyaret ediyorlar.'],
          ['Un curso para preparar mermelada de frutas.', 'Meyve reçeli tatlıda geçiyor. Reçel yapımıyla ilgili bir kurs yok.']
        ]
      },
      {
        prompt: '¿Qué descubrieron en Cuzcurrita de Río Tirón?',
        answer: 3,
        options: [
          ['Un hotel moderno diseñado en 2006.', '2006’da tasarlanan modern otel ilk kayıtta, Elciego’da geçiyor.'],
          ['Un globo de colores para visitar los viñedos.', 'Renkli balon ikinci kayıtta yer alıyor. Bu kasabadaki keşif yer altında.'],
          ['Un monasterio conocido por su arquitectura gótica.', 'Gotik manastır metnin başında Cañas’la bağlantılı olarak tanıtılıyor. Cuzcurrita’daki ziyaret farklı.'],
          ['Una bodega subterránea activa desde hace generaciones.', '«En funcionamiento durante generaciones» mekânın kuşaklardır kullanılmakta olduğunu söylüyor. Yeraltı mahzenlerinde şarap yavaşça yıllanıyor.']
        ]
      },
      {
        prompt: '¿Qué pidieron como plato principal en el restaurante?',
        answer: 1,
        options: [
          ['Patatas a la riojana.', 'Bu patates yemeğini «de entrante», yani başlangıç olarak istiyorlar.'],
          ['Cordero asado al horno con ajo y hierbas aromáticas.', '«De plato principal» ifadesinden hemen sonra fırında sarımsak ve aromatik otlarla pişmiş kuzu eti geliyor.'],
          ['Una tarta de queso con mermelada.', 'Reçelli cheesecake «de postre», yani tatlı olarak geçiyor.'],
          ['Pollo al horno con patatas y pimiento.', 'Fırında pişen et kuzu eti. Patates ve kırmızı biber ise başlangıç yemeğinde geçiyor.']
        ]
      },
      {
        prompt: '¿Con qué sentimiento piensan despedirse de La Rioja?',
        answer: 2,
        options: [
          ['Con alivio porque la experiencia fue agotadora.', 'Otele mutlu dönüyorlar. Yorucu bir gezinin bitmesinden duyulan rahatlama anlatılmıyor.'],
          ['Con decepción porque no pudieron visitar una bodega.', 'Birden fazla şaraphane görüyorlar. Son değerlendirmeleri de olumlu.'],
          ['Con gratitud por lo que han vivido en la región.', '«Agradecimiento y gratitud» doğrudan minnettarlık anlamına geliyor. Bölgeyi her zaman kalplerinde taşıyacaklarını söylüyorlar.'],
          ['Con indiferencia porque no quieren recordar el viaje.', 'Anlatıcı geziyi eşsiz bir deneyim olarak görüyor ve onu hatırlamak istiyor.']
        ]
      }
    ]
  }
];

const RIOJA_VOCABULARY = [
  {
    prompt: 'En el primer texto toman una copa en una «sala de degustación». ¿Qué significa «degustación»?',
    answer: 3,
    options: [
      ['Aprender a cultivar la vid.', 'Asma yetiştirmek bağcılıkla ilgilidir. Tadım sırasında ürünün tadına bakılır.'],
      ['Reservar una habitación para la noche.', 'Oda ayırtmak «hacer una reserva» ile ifade edilir. «Degustación» konaklamayı anlatmaz.'],
      ['Guardar un producto para que envejezca.', 'Ürünü yıllandırmak «dejar envejecer». Tadım, ürünün o andaki tadını deneyimlemektir.'],
      ['Probar alimentos o bebidas para apreciar su sabor.', '«Degustar» yiyecek veya içeceğin tadına bakmak demek. İlk metindeki salonda tadılan içecek şarap.']
    ]
  },
  {
    prompt: 'En el segundo texto, ¿qué momento del día indica «al amanecer»?',
    answer: 1,
    options: [
      ['Cuando el sol se pone.', 'Güneş batarken «al atardecer» denir. «Al amanecer» sabaha aittir.'],
      ['Cuando empieza a salir el sol.', '«Amanecer» günün aydınlanmaya başlamasıdır. Balon uçuşu bu vakitte düzenleniyor.'],
      ['Cuando el sol está más alto.', 'Bu, öğle vaktine işaret eder. «Amanecer» daha erkendir.'],
      ['Cuando ya es medianoche.', 'Gece yarısı «a medianoche» şeklinde söylenir. «Al amanecer» gün doğumudur.']
    ]
  },
  {
    prompt: 'En el tercer texto, ¿qué significa «bodega subterránea»?',
    answer: 0,
    options: [
      ['Una bodega situada bajo el nivel del suelo.', '«Subterránea» yer altında demektir. Gezginler mahzenlere ulaşmak için aşağı indiklerini söylüyorlar.'],
      ['Una bodega situada en la cima de una montaña.', 'Bu tanım, dağın zirvesini tarif eder. «Subterránea» yükseklik değil, yerin altını belirtir.'],
      ['Una bodega que solo abre durante la noche.', 'Sözcük, şaraphanenin açılış saatini değil, nerede bulunduğunu anlatıyor.'],
      ['Una bodega al aire libre.', 'Açık hava, «al aire libre» ile ifade edilir. Metindeki mahzen toprağın altında.']
    ]
  },
  {
    prompt: 'En «aprender a apreciar sus matices y sabores», ¿qué son los «matices»?',
    answer: 2,
    options: [
      ['Los precios de distintas botellas.', 'Bu cümle fiyatları karşılaştırmıyor. Tadım sırasında fark edilen özellikleri anlatıyor.'],
      ['Las etiquetas que indican el origen.', 'Etiketler «etiquetas» olur. «Matices» burada duyularla fark edilen ayrıntılar.'],
      ['Las diferencias sutiles que se perciben al probar algo.', '«Matiz» küçük ve ince farklılık demek. Şarap tadımında farklı tat ve aroma tonlarını ifade edebilir.'],
      ['Los recipientes donde se almacena el vino.', 'Depolamada kullanılan fıçılar «barricas» olarak geçiyor. «Matices» bir kap adı değil.']
    ]
  },
  {
    prompt: '¿Qué adjetivo del segundo texto se refiere tanto al cultivo de la vid como a la elaboración de vino?',
    answer: 3,
    options: [
      ['Estrellado.', '«Estrellado» yıldızlarla dolu demek ve gecenin gökyüzünü betimliyor.'],
      ['Colorido.', '«Colorido» rengârenk anlamına geliyor. Metinde balonun görünümünü anlatıyor.'],
      ['Impresionante.', '«Impresionante» etkileyici demek. Bir şarapçılık terimi olarak kullanılmıyor.'],
      ['Vitivinícola.', '«Vitivinícola», bağcılığı ve şarap üretimini birlikte kapsar. Metindeki bölgeyi bu iki faaliyetiyle niteliyor.']
    ]
  }
];
