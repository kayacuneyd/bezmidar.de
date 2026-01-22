/**
 * AcikKuran API Service
 * https://github.com/acik-kuran/acikkuran-api
 */

const API_BASE = 'https://api.acikkuran.com'

// Juz bilgileri - hangi sureler hangi cüzde
export const JUZ_INFO = [
    { juz: 1, startSurah: 1, startVerse: 1, endSurah: 2, endVerse: 141 },
    { juz: 2, startSurah: 2, startVerse: 142, endSurah: 2, endVerse: 252 },
    { juz: 3, startSurah: 2, startVerse: 253, endSurah: 3, endVerse: 92 },
    { juz: 4, startSurah: 3, startVerse: 93, endSurah: 4, endVerse: 23 },
    { juz: 5, startSurah: 4, startVerse: 24, endSurah: 4, endVerse: 147 },
    { juz: 6, startSurah: 4, startVerse: 148, endSurah: 5, endVerse: 81 },
    { juz: 7, startSurah: 5, startVerse: 82, endSurah: 6, endVerse: 110 },
    { juz: 8, startSurah: 6, startVerse: 111, endSurah: 7, endVerse: 87 },
    { juz: 9, startSurah: 7, startVerse: 88, endSurah: 8, endVerse: 40 },
    { juz: 10, startSurah: 8, startVerse: 41, endSurah: 9, endVerse: 92 },
    { juz: 11, startSurah: 9, startVerse: 93, endSurah: 11, endVerse: 5 },
    { juz: 12, startSurah: 11, startVerse: 6, endSurah: 12, endVerse: 52 },
    { juz: 13, startSurah: 12, startVerse: 53, endSurah: 14, endVerse: 52 },
    { juz: 14, startSurah: 15, startVerse: 1, endSurah: 16, endVerse: 128 },
    { juz: 15, startSurah: 17, startVerse: 1, endSurah: 18, endVerse: 74 },
    { juz: 16, startSurah: 18, startVerse: 75, endSurah: 20, endVerse: 135 },
    { juz: 17, startSurah: 21, startVerse: 1, endSurah: 22, endVerse: 78 },
    { juz: 18, startSurah: 23, startVerse: 1, endSurah: 25, endVerse: 20 },
    { juz: 19, startSurah: 25, startVerse: 21, endSurah: 27, endVerse: 55 },
    { juz: 20, startSurah: 27, startVerse: 56, endSurah: 29, endVerse: 45 },
    { juz: 21, startSurah: 29, startVerse: 46, endSurah: 33, endVerse: 30 },
    { juz: 22, startSurah: 33, startVerse: 31, endSurah: 36, endVerse: 27 },
    { juz: 23, startSurah: 36, startVerse: 28, endSurah: 39, endVerse: 31 },
    { juz: 24, startSurah: 39, startVerse: 32, endSurah: 41, endVerse: 46 },
    { juz: 25, startSurah: 41, startVerse: 47, endSurah: 45, endVerse: 37 },
    { juz: 26, startSurah: 46, startVerse: 1, endSurah: 51, endVerse: 30 },
    { juz: 27, startSurah: 51, startVerse: 31, endSurah: 57, endVerse: 29 },
    { juz: 28, startSurah: 58, startVerse: 1, endSurah: 66, endVerse: 12 },
    { juz: 29, startSurah: 67, startVerse: 1, endSurah: 77, endVerse: 50 },
    { juz: 30, startSurah: 78, startVerse: 1, endSurah: 114, endVerse: 6 }
]

// Sure isimleri
export const SURAH_NAMES = {
    1: { arabic: 'الفاتحة', turkish: 'Fatiha', english: 'Al-Fatiha' },
    2: { arabic: 'البقرة', turkish: 'Bakara', english: 'Al-Baqarah' },
    3: { arabic: 'آل عمران', turkish: 'Al-i Imran', english: 'Ali Imran' },
    4: { arabic: 'النساء', turkish: 'Nisa', english: 'An-Nisa' },
    5: { arabic: 'المائدة', turkish: 'Maide', english: 'Al-Maidah' },
    6: { arabic: 'الأنعام', turkish: 'Enam', english: 'Al-Anam' },
    7: { arabic: 'الأعراف', turkish: 'Araf', english: 'Al-Araf' },
    // Diğer sureler API'den alınacak
}

/**
 * Tüm sureleri getir
 */
export async function getSurahs() {
    const response = await fetch(`${API_BASE}/surahs`)
    if (!response.ok) throw new Error('Sureler yüklenemedi')
    return response.json()
}

/**
 * Belirli bir sureyi ayetleriyle getir
 */
export async function getSurah(surahId) {
    // author param removed due to API 404 error. Returns default translation (Erhan Aktaş)
    const response = await fetch(`${API_BASE}/surah/${surahId}`)
    if (!response.ok) throw new Error('Sure yüklenemedi')
    return response.json()
}

/**
 * Belirli bir ayeti getir
 */
export async function getVerse(surahId, verseId) {
    const response = await fetch(`${API_BASE}/surah/${surahId}/verse/${verseId}`)
    if (!response.ok) throw new Error('Ayet yüklenemedi')
    return response.json()
}

/**
 * Belirli bir cüzün ayetlerini getir
 */
export async function getJuzVerses(juzNumber) {
    const juzInfo = JUZ_INFO.find(j => j.juz === juzNumber)
    if (!juzInfo) throw new Error('Geçersiz cüz numarası')

    const verses = []

    // Cüzdeki tüm sureleri getir
    for (let surahId = juzInfo.startSurah; surahId <= juzInfo.endSurah; surahId++) {
        const surah = await getSurah(surahId)

        let startVerse = surahId === juzInfo.startSurah ? juzInfo.startVerse : 1
        let endVerse = surahId === juzInfo.endSurah ? juzInfo.endVerse : surah.data.verse_count

        const surahVerses = surah.data.verses.filter(v =>
            v.verse_number >= startVerse && v.verse_number <= endVerse
        )

        verses.push({
            surah: {
                id: surah.data.id,
                name: surah.data.name,
                name_original: surah.data.name_original,
                slug: surah.data.slug
            },
            verses: surahVerses
        })
    }

    return {
        juz: juzNumber,
        surahs: verses
    }
}

/**
 * Sure bazlı sayfalama ile ayetleri getir
 */
export async function getSurahPage(surahId, page = 1, perPage = 10, authorId = 77) {
    const surah = await getSurah(surahId, authorId)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage

    return {
        surah: {
            id: surah.data.id,
            name: surah.data.name,
            name_original: surah.data.name_original,
            verse_count: surah.data.verse_count
        },
        verses: surah.data.verses.slice(startIndex, endIndex),
        pagination: {
            page,
            perPage,
            total: surah.data.verse_count,
            totalPages: Math.ceil(surah.data.verse_count / perPage)
        }
    }
}

export default {
    getSurahs,
    getSurah,
    getVerse,
    getJuzVerses,
    getSurahPage,
    JUZ_INFO,
    SURAH_NAMES
}
