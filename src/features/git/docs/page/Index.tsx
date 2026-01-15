import React, { useState } from 'react'
import { Book, Menu, X, GitBranch, Terminal, Shield, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react'

// --- DATA KONTEN DOKUMENTASI ---
type DocSection = {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

const docSections: DocSection[] = [
  {
    id: 'intro',
    title: 'Pengantar',
    icon: <Book size={18} />,
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Frontend Engineering Guidelines</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Selamat datang di dokumentasi standar kerja tim Frontend Project Alpha. Dokumen ini dirancang sebagai &quot;Single Source of Truth&quot;
          untuk menjaga kualitas kode, kerapian history Git, dan meminimalisir konflik antar developer.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-blue-700 font-medium">
            💡 Aturan Emas: Konsistensi adalah kunci. Ikuti panduan ini agar tim bisa bergerak cepat tanpa saling tabrak.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'branching',
    title: 'Strategi Branching',
    icon: <GitBranch size={18} />,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <GitBranch className="text-blue-600" /> Strategi Branching
        </h2>
        <p className="text-slate-600">
          Kita menggunakan metodologi <strong>Feature Branch Workflow</strong>. Jangan pernah melakukan commit langsung ke branch utama.
        </p>

        <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            <li>
              <strong>main</strong>: Branch suci. Kode di sini harus stabil (Production Ready).
            </li>
            <li>
              <strong>feature/*</strong>: Branch tempat developer bekerja.
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mt-6">Format Penamaan Branch</h3>
        <p className="text-slate-600 mb-4">
          Gunakan format: <code className="bg-slate-100 px-2 py-1 rounded text-red-500 font-mono text-sm">tipe/deskripsi-singkat-kebab-case</code>
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kegunaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contoh Valid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-purple-600">feat</td>
                <td className="px-6 py-4 text-sm text-slate-600">Fitur baru</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">feat/login-page</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-red-600">fix</td>
                <td className="px-6 py-4 text-sm text-slate-600">Perbaikan bug</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">fix/navbar-overlap</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-blue-600">style</td>
                <td className="px-6 py-4 text-sm text-slate-600">Perubahan UI/CSS (tanpa logika)</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">style/dark-mode</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-amber-600">chore</td>
                <td className="px-6 py-4 text-sm text-slate-600">Maintenance / Config</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">chore/update-dependencies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 'commits',
    title: 'Commit Convention',
    icon: <Terminal size={18} />,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="text-blue-600" /> Commit Message
        </h2>
        <p className="text-slate-600">
          Kita mengikuti standar <strong>Conventional Commits</strong>. Pesan commit harus jelas, imperatif, dan dalam Bahasa Inggris.
        </p>

        <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-sm shadow-lg overflow-x-auto">
          <p className="text-slate-400 mb-2">{'// Format Dasar'}</p>
          <p className="mb-4 text-green-400">tipe: deskripsi singkat apa yang dilakukan</p>

          <p className="text-slate-400 mb-2">{'// Contoh Bagus ✅'}</p>
          <p>feat: add submit button on contact form</p>
          <p>style: change primary color to blue</p>
          <p>fix: resolve crash on user profile load</p>

          <p className="text-slate-400 mt-4 mb-2">{'// Contoh Buruk ❌'}</p>
          <p className="text-red-400">nambahin tombol</p>
          <p className="text-red-400">fixing bugs</p>
          <p className="text-red-400">final commit bang</p>
        </div>
      </div>
    )
  },
  {
    id: 'workflow',
    title: 'Workflow Harian',
    icon: <CheckCircle size={18} />,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Alur Kerja (Workflow)</h2>
        <p className="text-slate-600 mb-6">Setiap developer wajib mengikuti urutan langkah ini untuk menghindari konflik.</p>

        <div className="space-y-4">
          {[
            { title: 'Ambil Tiket', desc: 'Cek GitHub Issues/Project Board. Assign diri sendiri.' },
            { title: 'Update Local Main', desc: 'Pastikan laptop kamu sinkron dengan server. `git checkout main` lalu `git pull origin main`.' },
            { title: 'Buat Branch', desc: 'Buat branch baru sesuai tiket. `git checkout -b feat/nama-fitur`.' },
            { title: 'Coding & Commit', desc: 'Lakukan perubahan kecil dan commit sering (Atomic Commits).' },
            {
              title: 'Cek Konflik (PENTING)',
              desc: 'Sebelum push, tarik main terbaru ke branch kamu: `git fetch origin` lalu `git merge origin/main`.'
            },
            { title: 'Push & PR', desc: 'Push ke GitHub dan buat Pull Request.' }
          ].map((step, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start bg-white p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">{idx + 1}</div>
              <div>
                <h4 className="font-bold text-slate-800">{step.title}</h4>
                <p className="text-sm text-slate-600 font-mono mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'pr',
    title: 'Pull Request Rules',
    icon: <Shield size={18} />,
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Panduan Pull Request (PR)</h2>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
          <p className="text-amber-800">PR adalah gerbang terakhir sebelum kode masuk ke Production. Pastikan deskripsi lengkap.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-slate-500" /> Checklist PR
            </h3>
            <ul className="space-y-3">
              {[
                'Judul PR sama dengan format commit',
                "Deskripsi menjelaskan 'WHAT' dan 'WHY'",
                'Lampirkan Screenshot jika ada perubahan UI',
                "Link Issue menggunakan keyword 'Closes #ID'",
                'Sudah di-review oleh minimal 1 orang'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500 mt-0.5">✔</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" /> Kapan PR di-Merge?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-blue-500 font-bold">1.</span> Lolos Code Review (Approved)
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-blue-500 font-bold">2.</span> Tidak ada konflik (All checks passed)
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-blue-500 font-bold">3.</span> Fitur sudah dites di local
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
]

// --- COMPONENTS ---

const SidebarItem: React.FC<{ section: DocSection; isActive: boolean; onClick: () => void }> = ({ section, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
      ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
  >
    <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{section.icon}</span>
    {section.title}
    {isActive && <ChevronRight size={16} className="ml-auto text-blue-600" />}
  </button>
)

export default function App() {
  const [activeId, setActiveId] = useState('intro')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const activeSection = docSections.find((s) => s.id === activeId) || docSections[0]

  // Close mobile menu when selection changes
interface SectionClickHandler {
    (id: string): void
}

const handleSectionClick: SectionClickHandler = (id) => {
    setActiveId(id)
    setIsMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <Book className="text-blue-600" size={20} /> Docs
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">FE</div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">Frontend Team</h1>
              <p className="text-xs text-slate-500">Engineering Standards v1.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Daftar Isi</p>
          {docSections.map((section) => (
            <SidebarItem key={section.id} section={section} isActive={activeId === section.id} onClick={() => handleSectionClick(section.id)} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-200 rounded-lg p-3 text-xs text-slate-600 text-center">&copy; 2024 Internal Documentation</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10 md:px-12 md:py-12 min-h-screen">
          <div className="mb-2 text-sm text-blue-600 font-medium flex items-center gap-2">
            Docs <ChevronRight size={14} /> {activeSection.title}
          </div>

          <div className="prose prose-slate max-w-none">{activeSection.content}</div>

          {/* Navigation Footer */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between">
            {/* Logic to show Prev/Next buttons could go here */}
            <div className="text-slate-400 text-sm italic">Last updated: Just now</div>
          </div>
        </div>
      </main>
    </div>
  )
}
