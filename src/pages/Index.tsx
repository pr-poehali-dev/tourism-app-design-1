import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/9f153344-a91e-4147-aa9d-9fa9ae3d2a8e/files/1b9c88c1-38b1-4f4d-a2f9-e14680fb2b36.jpg";
const EUROPE_IMG = "https://cdn.poehali.dev/projects/9f153344-a91e-4147-aa9d-9fa9ae3d2a8e/files/0f237d72-d5cf-41d7-bd87-6067f8bd8892.jpg";
const ADVENTURE_IMG = "https://cdn.poehali.dev/projects/9f153344-a91e-4147-aa9d-9fa9ae3d2a8e/files/6f009b5a-67eb-4456-a074-5a8d0660eb74.jpg";

const TOURS = [
  { id: 1, title: "Бали: Остров богов", country: "Индонезия", type: "Пляж", days: 10, price: 89000, rating: 4.9, reviews: 234, image: HERO_IMG, tag: "🔥 Хит", direction: "Азия", dates: ["Май", "Июнь", "Июль"] },
  { id: 2, title: "Рим & Флоренция", country: "Италия", type: "Экскурсии", days: 8, price: 112000, rating: 4.8, reviews: 189, image: EUROPE_IMG, tag: "✨ Новинка", direction: "Европа", dates: ["Апрель", "Сентябрь", "Октябрь"] },
  { id: 3, title: "Мачу-Пикчу", country: "Перу", type: "Приключение", days: 14, price: 145000, rating: 4.9, reviews: 97, image: ADVENTURE_IMG, tag: "⚡ Лимит", direction: "Латинская Америка", dates: ["Июнь", "Июль", "Август"] },
  { id: 4, title: "Дубай: Люкс 5★", country: "ОАЭ", type: "Люкс", days: 7, price: 98000, rating: 4.7, reviews: 312, image: EUROPE_IMG, tag: "", direction: "Ближний Восток", dates: ["Октябрь", "Ноябрь", "Декабрь"] },
  { id: 5, title: "Таиланд: Острова", country: "Таиланд", type: "Пляж", days: 12, price: 76000, rating: 4.8, reviews: 445, image: HERO_IMG, tag: "🔥 Хит", direction: "Азия", dates: ["Ноябрь", "Декабрь", "Январь"] },
  { id: 6, title: "Норвегия: Фьорды", country: "Норвегия", type: "Природа", days: 9, price: 134000, rating: 4.9, reviews: 78, image: ADVENTURE_IMG, tag: "✨ Новинка", direction: "Европа", dates: ["Июнь", "Июль", "Август"] },
];

const DIRECTIONS = ["Все", "Азия", "Европа", "Латинская Америка", "Ближний Восток"];
const TYPES = ["Все", "Пляж", "Экскурсии", "Приключение", "Люкс", "Природа"];
const MONTHS = ["Все", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const REVIEWS = [
  { name: "Алина К.", city: "Москва", text: "WayOut полностью изменили мой взгляд на путешествия! Бали был просто космос. Всё организовано идеально, гиды — супер.", tour: "Бали 2024", avatar: "А", stars: 5 },
  { name: "Дмитрий Р.", city: "СПб", text: "Четвёртый тур с этими ребятами. Каждый раз превышают ожидания. Рим был настоящим открытием, маршрут продуман до мелочей.", tour: "Рим & Флоренция", avatar: "Д", stars: 5 },
  { name: "Мария С.", city: "Казань", text: "Мечтала о Мачу-Пикчу 5 лет. WayOut воплотили мечту в реальность. Незабываемо, рекомендую всем!", tour: "Мачу-Пикчу 2024", avatar: "М", stars: 5 },
  { name: "Игорь В.", city: "Новосибирск", text: "Дубай превзошёл все ожидания. Отель 5★, экскурсии, шоппинг — всё включено. Цена отличная для такого качества!", tour: "Дубай 2024", avatar: "И", stars: 5 },
];

const BLOG = [
  { title: "10 причин поехать на Бали прямо сейчас", category: "Азия", date: "28 марта", reads: "4.2к", img: HERO_IMG },
  { title: "Европа на рюкзаке: маршрут за 2 недели", category: "Европа", date: "15 марта", reads: "6.8к", img: EUROPE_IMG },
  { title: "Как не потратить всё в аэропорту: лайфхаки", category: "Советы", date: "5 апреля", reads: "9.1к", img: ADVENTURE_IMG },
];

const FAQ_ITEMS = [
  { q: "Как оформить тур?", a: "Выберите понравившийся тур, нажмите «Забронировать», оставьте заявку. Наш менеджер свяжется с вами в течение 30 минут." },
  { q: "Нужна ли виза?", a: "Зависит от направления. Мы помогаем оформить визу для большинства стран или подбираем безвизовые маршруты." },
  { q: "Можно ли изменить даты после бронирования?", a: "Да, не позднее чем за 30 дней до отъезда. Изменения возможны при наличии свободных мест." },
  { q: "Что входит в стоимость тура?", a: "Авиабилеты, трансфер, отель, завтраки и все перечисленные экскурсии. Доп. питание и шоппинг — за свой счёт." },
  { q: "Есть ли страховка?", a: "Медицинская страховка включена в каждый тур. Мы также предлагаем расширенное страхование с отменой поездки." },
];

function useIntersection(ref: React.RefObject<Element>, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function AnimSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterDirection, setFilterDirection] = useState("Все");
  const [filterType, setFilterType] = useState("Все");
  const [filterMonth, setFilterMonth] = useState("Все");
  const [priceMax, setPriceMax] = useState(200000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);

  const filteredTours = TOURS.filter(t => {
    if (filterDirection !== "Все" && t.direction !== filterDirection) return false;
    if (filterType !== "Все" && t.type !== filterType) return false;
    if (filterMonth !== "Все" && !t.dates.includes(filterMonth)) return false;
    if (t.price > priceMax) return false;
    return true;
  });

  const navLinks = [
    { id: "home", label: "Главная" },
    { id: "tours", label: "Туры" },
    { id: "about", label: "О нас" },
    { id: "reviews", label: "Отзывы" },
    { id: "blog", label: "Блог" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Контакты" },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-golos">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("home")}>
            <div className="w-8 h-8 grad-bg rounded-lg flex items-center justify-center text-white font-oswald font-bold text-sm">W</div>
            <span className="font-oswald text-xl font-bold text-white">WAY<span className="grad-text">OUT</span></span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeSection === l.id ? "grad-bg text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex grad-bg text-white px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform">
              Подобрать тур
            </button>
            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass-strong border-t border-white/10 px-4 py-4 flex flex-col gap-2">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all ${activeSection === l.id ? "grad-bg text-white" : "text-white/70 hover:bg-white/5"}`}>
                {l.label}
              </button>
            ))}
            <button className="mt-2 grad-bg text-white py-3 rounded-xl text-sm font-semibold">Подобрать тур</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Hero" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f1a]/60 via-[#0d0f1a]/40 to-[#0d0f1a]" />
          <div className="absolute inset-0 mesh-bg" />
        </div>

        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#9B30FF]/10 blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#FF5C00]/10 blur-[100px] animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className={`transition-all duration-1000 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
              <span className="text-white/70 text-sm">Более 5000 путешественников уже с нами</span>
            </div>

            <h1 className="font-oswald text-6xl md:text-8xl lg:text-[7rem] font-bold leading-none mb-6 uppercase tracking-tight">
              <span className="text-white">Твой</span><br />
              <span className="grad-text">следующий</span><br />
              <span className="text-white">маршрут</span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Яркие туры для тех, кто не хочет скучать. Без шаблонов, без переплат — только незабываемые впечатления.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button onClick={() => scrollTo("tours")}
                className="grad-bg text-white px-8 py-4 rounded-full text-base font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                Смотреть туры
                <Icon name="ArrowRight" size={18} />
              </button>
              <button className="glass text-white px-8 py-4 rounded-full text-base font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                <Icon name="Play" size={18} />
                Смотреть видео
              </button>
            </div>
          </div>

          <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-300 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {[
              { num: "5000+", label: "Путешественников", icon: "Users" },
              { num: "120+", label: "Направлений", icon: "Globe" },
              { num: "98%", label: "Довольны туром", icon: "Star" },
              { num: "24/7", label: "Поддержка", icon: "Headphones" },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 grad-bg rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={s.icon} fallback="Circle" size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-oswald text-2xl font-bold text-white">{s.num}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOURS */}
      <section id="tours" className="py-24 relative">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4">
          <AnimSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-[#FF5C00] font-semibold text-sm uppercase tracking-widest mb-2">Наши туры</p>
                <h2 className="font-oswald text-5xl md:text-6xl font-bold text-white uppercase">
                  Найди <span className="grad-text">свой</span> маршрут
                </h2>
              </div>
              <p className="text-white/50 max-w-sm">Используй фильтры, чтобы найти идеальный тур под твои даты и бюджет</p>
            </div>
          </AnimSection>

          <AnimSection className="mb-8">
            <div className="glass rounded-3xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Направление</p>
                  <div className="flex flex-wrap gap-2">
                    {DIRECTIONS.map(d => (
                      <button key={d} onClick={() => setFilterDirection(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterDirection === d ? "grad-bg text-white" : "glass text-white/60 hover:text-white"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Тип тура</p>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map(t => (
                      <button key={t} onClick={() => setFilterType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? "grad-bg text-white" : "glass text-white/60 hover:text-white"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Месяц</p>
                  <div className="flex flex-wrap gap-2">
                    {MONTHS.slice(0, 7).map(m => (
                      <button key={m} onClick={() => setFilterMonth(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterMonth === m ? "grad-bg text-white" : "glass text-white/60 hover:text-white"}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                    Цена до: <span className="text-white font-semibold">{(priceMax / 1000).toFixed(0)}к ₽</span>
                  </p>
                  <input type="range" min={50000} max={200000} step={5000} value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#FF5C00]" />
                  <div className="flex justify-between text-white/30 text-xs mt-1">
                    <span>50к</span><span>200к</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimSection>

          {filteredTours.length === 0 ? (
            <div className="text-center py-20 text-white/40">
              <Icon name="SearchX" size={48} className="mx-auto mb-4" />
              <p className="text-lg">По выбранным фильтрам туров нет</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour, i) => (
                <AnimSection key={tour.id}>
                  <div className="glass rounded-3xl overflow-hidden card-hover cursor-pointer">
                    <div className="relative h-52 overflow-hidden">
                      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {tour.tag && (
                        <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full text-xs font-bold text-white">{tour.tag}</div>
                      )}
                      <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg text-xs text-white/80">{tour.type}</div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Icon key={j} name="Star" size={12} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-white text-xs ml-1">{tour.rating} ({tour.reviews})</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-oswald text-xl font-bold text-white uppercase leading-tight mb-1">{tour.title}</h3>
                      <div className="flex items-center gap-1 mb-4 text-white/50 text-sm">
                        <Icon name="MapPin" size={13} />
                        <span>{tour.country}</span>
                        <span className="mx-1">·</span>
                        <Icon name="Clock" size={13} />
                        <span>{tour.days} дней</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white/40 text-xs">от</span>
                          <span className="font-oswald text-2xl font-bold text-white ml-1">{(tour.price / 1000).toFixed(0)}к</span>
                          <span className="text-white/40 text-sm"> ₽</span>
                        </div>
                        <button className="grad-bg text-white px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform">
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
          <img src={EUROPE_IMG} alt="About" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f1a] to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-xl">
            <AnimSection>
              <p className="text-[#FF2D78] font-semibold text-sm uppercase tracking-widest mb-2">О нас</p>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold text-white uppercase mb-6">
                Мы не продаём туры — <span className="grad-text">мы создаём истории</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                WayOut — команда путешественников, которые сами объездили 80+ стран. Мы создаём маршруты, которые хочется повторить, и которые невозможно забыть.
              </p>
            </AnimSection>
            <AnimSection>
              <div className="space-y-4">
                {[
                  { icon: "Zap", title: "Быстрое оформление", desc: "Вся документация за 2 часа. Никаких очередей и бумажек." },
                  { icon: "Shield", title: "Полная безопасность", desc: "Страховка, поддержка 24/7, проверенные партнёры." },
                  { icon: "Heart", title: "Только лучшее", desc: "Каждый тур проверен нашей командой лично." },
                ].map(item => (
                  <div key={item.title} className="glass rounded-2xl p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 grad-bg rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} fallback="Circle" size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-0.5">{item.title}</h4>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 relative">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4">
          <AnimSection className="text-center mb-14">
            <p className="text-[#00D4FF] font-semibold text-sm uppercase tracking-widest mb-2">Отзывы</p>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold text-white uppercase">
              Что говорят <span className="grad-text">путешественники</span>
            </h2>
          </AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((r, i) => (
              <AnimSection key={i}>
                <div className="glass rounded-3xl p-6 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 grad-bg rounded-2xl flex items-center justify-center font-oswald font-bold text-white text-lg">
                      {r.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{r.name}</div>
                      <div className="text-white/40 text-sm">{r.city} · {r.tour}</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(r.stars)].map((_, j) => (
                        <Icon key={j} name="Star" size={14} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">&quot;{r.text}&quot;</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <AnimSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[#9B30FF] font-semibold text-sm uppercase tracking-widest mb-2">Блог</p>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold text-white uppercase">
                Вдохновение <span className="grad-text">в каждой статье</span>
              </h2>
            </div>
            <button className="glass text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 self-start">
              Все статьи <Icon name="ArrowRight" size={16} />
            </button>
          </AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG.map((b, i) => (
              <AnimSection key={i}>
                <div className="glass rounded-3xl overflow-hidden card-hover cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={b.img} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full text-xs text-white/80">{b.category}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-oswald text-xl font-bold text-white uppercase mb-3 leading-tight">{b.title}</h3>
                    <div className="flex items-center justify-between text-white/40 text-xs">
                      <span className="flex items-center gap-1"><Icon name="Calendar" size={12} />{b.date}</span>
                      <span className="flex items-center gap-1"><Icon name="Eye" size={12} />{b.reads} читателей</span>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 relative">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4">
          <AnimSection className="text-center mb-14">
            <p className="text-[#FF5C00] font-semibold text-sm uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold text-white uppercase">
              Вопросы <span className="grad-text">и ответы</span>
            </h2>
          </AnimSection>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AnimSection key={i}>
                <div className={`glass rounded-2xl overflow-hidden transition-all duration-300`}>
                  <button className="w-full p-5 flex items-center justify-between text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white font-semibold pr-4">{item.q}</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openFaq === i ? "grad-bg" : "glass"}`}>
                      <Icon name={openFaq === i ? "Minus" : "Plus"} size={16} className="text-white" />
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-white/60 leading-relaxed border-t border-white/5 pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C00]/10 via-[#FF2D78]/5 to-[#9B30FF]/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimSection>
              <p className="text-[#FF2D78] font-semibold text-sm uppercase tracking-widest mb-2">Контакты</p>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold text-white uppercase mb-6">
                Готов <span className="grad-text">стартовать?</span>
              </h2>
              <p className="text-white/60 text-lg mb-8">Оставь заявку — менеджер перезвонит в течение 30 минут и подберёт идеальный тур для тебя.</p>
              <div className="space-y-4">
                {[
                  { icon: "Phone", text: "+7 (800) 555-01-23", label: "Звонок бесплатный" },
                  { icon: "Mail", text: "hello@wayout.travel", label: "Напиши нам" },
                  { icon: "MapPin", text: "Москва, Арбат 15", label: "Главный офис" },
                ].map(c => (
                  <div key={c.text} className="flex items-center gap-4">
                    <div className="w-12 h-12 grad-bg rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} fallback="Circle" size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{c.text}</div>
                      <div className="text-white/40 text-sm">{c.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimSection>

            <AnimSection>
              <div className="glass-strong rounded-3xl p-8">
                <h3 className="font-oswald text-2xl font-bold text-white uppercase mb-6">Оставить заявку</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Твоё имя"
                    className="w-full glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none border border-white/5 focus:border-[#FF5C00]/50 transition-colors" />
                  <input type="tel" placeholder="Номер телефона"
                    className="w-full glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none border border-white/5 focus:border-[#FF5C00]/50 transition-colors" />
                  <select className="w-full glass rounded-xl px-4 py-3 text-white/70 outline-none border border-white/5 bg-[#0d0f1a]">
                    <option value="" className="bg-[#0d0f1a]">Выбери направление</option>
                    {DIRECTIONS.slice(1).map(d => <option key={d} value={d} className="bg-[#0d0f1a]">{d}</option>)}
                  </select>
                  <textarea placeholder="Пожелания к туру (необязательно)" rows={3}
                    className="w-full glass rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none border border-white/5 focus:border-[#FF5C00]/50 transition-colors resize-none" />
                  <button className="w-full grad-bg text-white py-4 rounded-xl font-semibold text-base hover:scale-[1.02] transition-transform">
                    Отправить заявку →
                  </button>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 grad-bg rounded-lg flex items-center justify-center text-white font-oswald font-bold text-sm">W</div>
            <span className="font-oswald text-xl font-bold text-white">WAY<span className="grad-text">OUT</span></span>
          </div>
          <p className="text-white/30 text-sm">© 2024 WayOut. Все права защищены.</p>
          <div className="flex items-center gap-4">
            {[
              { icon: "Instagram", label: "Instagram" },
              { icon: "Youtube", label: "YouTube" },
              { icon: "MessageCircle", label: "Telegram" },
            ].map(s => (
              <button key={s.label} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <Icon name={s.icon} fallback="Circle" size={17} />
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}