import Link from "next/link";

export const metadata = {
  title: "KVKK Aydınlatma Metni | FlorioTR",
  description:
    "FlorioTR kişisel verilerin işlenmesine ilişkin KVKK Aydınlatma Metni.",
};

export default function KvkkAydinlatmaMetniPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-4 py-10 text-[#123f34]">
      <article className="mx-auto max-w-4xl rounded-[28px] bg-white p-6 shadow-xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8b6429]">
          FlorioTR
        </p>

        <h1 className="mt-2 text-3xl font-black">
          KVKK Aydınlatma Metni
        </h1>

        <p className="mt-3 text-sm font-semibold text-slate-500">
          Son güncelleme: 24 Ağustos 2026
        </p>

        <div className="mt-8 space-y-7 leading-7 text-slate-700">
          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              1. Veri Sorumlusu
            </h2>

            <p className="mt-2">
              FlorioTR internet sitesi ve hizmetleri kapsamında işlenen
              kişisel veriler bakımından veri sorumlusuna ilişkin ticari
              unvan, adres ve diğer resmi iletişim bilgileri, işletmenin
              resmi kuruluş bilgilerinin kesinleşmesinin ardından bu
              metinde ayrıca yayımlanacaktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              2. İşlenen Kişisel Veriler
            </h2>

            <p className="mt-2">
              FlorioTR hizmetlerinin kullanılması sırasında aşağıdaki
              kişisel veriler işlenebilir:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Ad ve soyad</li>
              <li>E-posta adresi</li>
              <li>Telefon numarası</li>
              <li>Teslimat ve iletişim adresleri</li>
              <li>Sipariş ve işlem bilgileri</li>
              <li>Ödeme işlemine ilişkin gerekli kayıtlar</li>
              <li>Müşteri destek talepleri ve iletişim kayıtları</li>
              <li>
                Site kullanımına ilişkin teknik ve güvenlik kayıtları
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              3. Kişisel Verilerin İşlenme Amaçları
            </h2>

            <p className="mt-2">
              Kişisel verileriniz aşağıdaki amaçlarla işlenebilir:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Üyelik hesabının oluşturulması ve yönetilmesi</li>
              <li>Siparişlerin alınması ve işleme konulması</li>
              <li>Teslimat sürecinin yürütülmesi</li>
              <li>Ödeme ve işlem güvenliğinin sağlanması</li>
              <li>Müşteri destek taleplerinin cevaplanması</li>
              <li>Sipariş durumu hakkında bilgilendirme yapılması</li>
              <li>
                Hukuki ve düzenleyici yükümlülüklerin yerine getirilmesi
              </li>
              <li>
                Sistem ve hesap güvenliğinin sağlanması, kötüye
                kullanımların önlenmesi
              </li>
            </ul>

            <p className="mt-3">
              Kampanya ve tanıtım amaçlı ticari elektronik ileti
              gönderimleri, gerekli olduğu durumlarda ayrıca verilen
              tercihe veya izne bağlı olarak yürütülür.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri
            </h2>

            <p className="mt-2">
              Kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması
              Kanunu&apos;nun 5. maddesinde düzenlenen hukuki sebeplerden
              uygun olanlarına dayanılarak işlenir.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili
                olması
              </li>
              <li>
                Veri sorumlusunun hukuki yükümlülüğünü yerine
                getirebilmesi
              </li>
              <li>
                Bir hakkın tesisi, kullanılması veya korunması için veri
                işlemenin zorunlu olması
              </li>
              <li>
                İlgili kişinin temel hak ve özgürlüklerine zarar
                vermemek kaydıyla veri sorumlusunun meşru menfaatleri
                için veri işlenmesinin zorunlu olması
              </li>
              <li>
                İşleme faaliyetinin açık rızaya dayanmasının gerekli
                olduğu durumlarda ilgili kişinin açık rızası
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              5. Kişisel Verilerin Aktarılması
            </h2>

            <p className="mt-2">
              Kişisel verileriniz, hizmetlerin yürütülmesi için gerekli
              olduğu ölçüde ve ilgili mevzuata uygun şekilde aşağıdaki
              alıcı gruplarına aktarılabilir:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Ödeme hizmeti sağlayıcıları</li>
              <li>Sipariş hazırlama ve teslimat süreçlerinde görev alan iş ortakları</li>
              <li>Barındırma, veri tabanı ve teknik altyapı hizmeti sağlayıcıları</li>
              <li>E-posta ve bildirim hizmeti sağlayıcıları</li>
              <li>
                Kanunen yetkili kamu kurumları, idari makamlar ve adli
                merciler
              </li>
            </ul>

            <p className="mt-3">
              Aktarımlar yalnızca hizmetin sağlanması, sipariş ve
              teslimat süreçlerinin yürütülmesi, güvenliğin sağlanması
              veya yasal yükümlülüklerin yerine getirilmesi gibi
              belirli amaçlarla gerçekleştirilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              6. Kişisel Verilerin Toplanma Yöntemi
            </h2>

            <p className="mt-2">
              Kişisel veriler; FlorioTR internet sitesi üzerinden
              doldurulan üyelik ve sipariş formları, hesap işlemleri,
              müşteri destek iletişimi ve hizmetlerin kullanılması
              sırasında oluşan elektronik kayıtlar aracılığıyla
              tamamen veya kısmen otomatik yöntemlerle elde edilebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              7. Verilerin Saklanması
            </h2>

            <p className="mt-2">
              Kişisel veriler, işlenme amaçlarının gerektirdiği süre
              boyunca ve ilgili mevzuatta öngörülen zorunlu saklama
              süreleri dikkate alınarak muhafaza edilir. Saklama
              süresinin sona ermesi ve verinin işlenmesini gerektiren
              başka bir hukuki sebep bulunmaması halinde veriler ilgili
              mevzuata uygun şekilde silinir, yok edilir veya anonim
              hale getirilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              8. KVKK Kapsamındaki Haklarınız
            </h2>

            <p className="mt-2">
              KVKK&apos;nın 11. maddesi kapsamında veri sorumlusuna
              başvurarak kişisel verilerinizle ilgili olarak;
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>
                İşlenmişse buna ilişkin bilgi talep etme
              </li>
              <li>
                İşlenme amacını ve amacına uygun kullanılıp
                kullanılmadığını öğrenme
              </li>
              <li>
                Verilerin aktarıldığı üçüncü kişileri bilme
              </li>
              <li>
                Eksik veya yanlış işlenmiş verilerin düzeltilmesini
                isteme
              </li>
              <li>
                Kanuni şartların oluşması halinde silinmesini veya yok
                edilmesini isteme
              </li>
              <li>
                Düzeltme, silme veya yok etme işlemlerinin verilerin
                aktarıldığı üçüncü kişilere bildirilmesini isteme
              </li>
              <li>
                Kanunda belirtilen diğer haklarınızı kullanma
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              9. Başvuru ve İletişim
            </h2>

            <p className="mt-2">
              Kişisel verilerinize ilişkin taleplerinizi, FlorioTR
              tarafından internet sitesinde yayımlanacak resmi iletişim
              kanalları üzerinden iletebilirsiniz.
            </p>

            <p className="mt-3 font-bold">
              Kurumsal e-posta adresimiz oluşturulduktan sonra bu
              bölümde ayrıca yayımlanacaktır.
            </p>
          </section>
        </div>

        <div className="mt-10 border-t pt-6">
          <Link
            href="/musteri/giris"
            className="font-black text-[#8b6429]"
          >
            ← Kayıt ekranına dön
          </Link>
        </div>
      </article>
    </main>
  );
}