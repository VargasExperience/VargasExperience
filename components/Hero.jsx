export default function Hero() {
  return (
    <section
      className="h-[35vh] min-h-[250px] bg-cover bg-center flex items-center justify-center border-b border-white/10"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="bg-black/80 px-8 py-6 rounded-xl text-center backdrop-blur-sm border border-white/10/50">
        <h1 className="text-3xl md:text-4xl font-black text-red-600 tracking-tight">
          VARGAS EXPERIENCE
        </h1>
        <button
          className="mt-4 px-5 py-2 text-sm bg-red-600 hover:bg-red-700 transition rounded font-semibold text-white shadow-lg shadow-red-600/20"
          onClick={() => {
            document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Ver catálogo
        </button>
      </div>
    </section>
  )
}
