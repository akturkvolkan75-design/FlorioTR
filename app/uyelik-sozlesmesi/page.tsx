import Link from "next/link";

export const metadata = {
  title: "Üyelik Sözleşmesi | FlorioTR",
  description:
    "FlorioTR üyelik hizmetlerine ilişkin kullanım ve üyelik koşulları.",
};

export default function UyelikSozlesmesiPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-4 py-10 text-[#123f34]">
      <article className="mx-auto max-w-4xl rounded-[28px] bg-white p-6 shadow-xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8b6429]">
          FlorioTR
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Üyelik Sözleşmesi
        </h1>

        <p className="mt-3 text-sm font-semibold text-slate-500">
          Son güncelleme: 24 Ağustos 2026
        </p>

        <div className="mt-8 space-y-7 leading-7 text-slate-700">
          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              1. Amaç
            </h2>

            <p className="mt-2">
              Bu Üyelik Sözleşmesi, FlorioTR internet sitesi
              üzerinden sunulan üyelik hizmetlerinin kullanım
              koşullarını ve üyelerin hak ve yükümlülüklerini
              düzenler.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              2. Üyelik
            </h2>

            <p className="mt-2">
              Kullanıcı, üyelik sırasında verdiği bilgilerin doğru,
              güncel ve kendisine ait olduğunu kabul eder. Kullanıcı
              hesabının ve şifresinin güvenliğinden kullanıcı
              sorumludur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              3. Hesabın Kullanımı
            </h2>

            <p className="mt-2">
              FlorioTR üyeliği kişiye özeldir. Hesap başka bir kişi
              adına veya hukuka aykırı amaçlarla kullanılamaz.
              FlorioTR, kötüye kullanım veya güvenlik riski tespit
              edilmesi halinde hesabı geçici olarak kısıtlayabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              4. Sipariş ve Ödeme
            </h2>

            <p className="mt-2">
              Üyelik oluşturulması tek başına bir ürün satın alma
              işlemi anlamına gelmez. Siparişe ilişkin ürün, fiyat,
              teslimat, ödeme ve diğer bilgiler sipariş sırasında
              ayrıca kullanıcıya sunulur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              5. Kullanıcının Yükümlülükleri
            </h2>

            <p className="mt-2">
              Kullanıcı; FlorioTR sistemini, içeriklerini ve
              hizmetlerini hukuka aykırı, yanıltıcı, zarar verici
              veya sistem güvenliğini tehlikeye düşürecek şekilde
              kullanmamayı kabul eder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              6. Kişisel Veriler
            </h2>

            <p className="mt-2">
              Üyelik sırasında ve hizmetlerin kullanımı boyunca
              işlenen kişisel verilere ilişkin açıklamalar FlorioTR
              KVKK Aydınlatma Metni&apos;nde yer almaktadır.
            </p>

            <Link
              href="/kvkk-aydinlatma-metni"
              className="mt-2 inline-block font-black text-[#8b6429] underline"
            >
              KVKK Aydınlatma Metni
            </Link>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              7. Ticari İletişim
            </h2>

            <p className="mt-2">
              Kampanya, indirim ve tanıtım amaçlı ticari elektronik
              iletiler için verilen izin üyelikten ayrı ve isteğe
              bağlıdır. Kullanıcı bu tercihinin değiştirilmesini
              daha sonra talep edebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              8. Sözleşmede Değişiklik
            </h2>

            <p className="mt-2">
              FlorioTR, hizmetlerde veya mevzuatta meydana gelen
              değişikliklere bağlı olarak bu sözleşmeyi
              güncelleyebilir. Güncel metin internet sitesi
              üzerinden yayımlanır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              9. Üyeliğin Sona Ermesi
            </h2>

            <p className="mt-2">
              Kullanıcı üyeliğinin kapatılmasını talep edebilir.
              Kanunen saklanması gereken kayıtlar ilgili saklama
              süreleri boyunca muhafaza edilebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#123f34]">
              10. İletişim
            </h2>

            <p className="mt-2">
              FlorioTR ile ilgili üyelik ve destek talepleri,
              internet sitesinde yayımlanan iletişim kanalları
              üzerinden iletilebilir.
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