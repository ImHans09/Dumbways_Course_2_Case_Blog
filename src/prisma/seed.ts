import { prismaClient } from "./client.js";

async function main() {
  // Truncate old records from table
  await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`);
  await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "categories" RESTART IDENTITY CASCADE`);
  await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "posts" RESTART IDENTITY CASCADE`);
  await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "comments" RESTART IDENTITY CASCADE`);

  // Initialize users data
  const users = [
    { name: "Andi Saputra", email: "andi.saputra@example.com", password: "passandi01" },
    { name: "Dewi Lestari", email: "dewi.lestari@example.com", password: "dewilest12" },
    { name: "Budi Santoso", email: "budi.santoso@example.com", password: "budisant88" },
    { name: "Fitri Rahmawati", email: "fitri.rahmawati@example.com", password: "fitrirahm90" },
    { name: "Joko Pranoto", email: "joko.pranoto@example.com", password: "joko123456" },
    { name: "Putri Anggraini", email: "putri.anggra@example.com", password: "putriangg12" },
    { name: "Herman Susilo", email: "herman.susilo@example.com", password: "hermanssl45" },
    { name: "Siti Maemunah", email: "siti.maemunah@example.com", password: "sitimey1234" },
    { name: "Rudi Haryanto", email: "rudi.haryanto@example.com", password: "rudih09aa" },
    { name: "Linda Marlina", email: "linda.marlina@example.com", password: "lindamarl99" }
  ];

  // Initialize categories data
  const categories = [
    { name: "Teknologi" },
    { name: "Lifestyle" },
    { name: "Pendidikan" },
    { name: "Kuliner" },
    { name: "Olahraga" }
  ];

  // Initialize posts data
  const posts = [
    { authorId: 1, categoryId: 1, title: "Perkembangan AI di 2025", content: "AI berkembang cepat..." },
    { authorId: 2, categoryId: 2, title: "Tips Hidup Minimalis", content: "Mulailah dari decluttering..." },
    { authorId: 3, categoryId: 3, title: "Cara Belajar Efektif", content: "Gunakan metode Pomodoro..." },
    { authorId: 4, categoryId: 4, title: "Resep Nasi Goreng Mantap", content: "Gunakan kecap premium..." },
    { authorId: 5, categoryId: 5, title: "Pemanasan Sebelum Olahraga", content: "Jangan langsung latihan..." },

    { authorId: 6, categoryId: 1, title: "Cloud Computing Mudah", content: "Gunakan layanan cloud..." },
    { authorId: 7, categoryId: 2, title: "Self Care di Akhir Pekan", content: "Luangkan waktu untuk diri sendiri..." },
    { authorId: 8, categoryId: 3, title: "Tips Menulis Skripsi", content: "Mulai dari outline..." },
    { authorId: 9, categoryId: 4, title: "Kuliner Street Food Enak", content: "Coba makanan pinggir jalan..." },
    { authorId: 10, categoryId: 5, title: "Manfaat Jogging", content: "Jogging tiap pagi..." },

    { authorId: 1, categoryId: 2, title: "Rutinitas Sehat Pagi Hari", content: "Bangun jam 5 pagi..." },
    { authorId: 2, categoryId: 3, title: "Belajar Bahasa Baru", content: "Gunakan metode immersion..." },
    { authorId: 3, categoryId: 4, title: "Kuliner Khas Bandung", content: "Surabi enak banget..." },
    { authorId: 4, categoryId: 5, title: "Tips Menambah Massa Otot", content: "Konsumsi protein cukup..." },
    { authorId: 5, categoryId: 1, title: "Belajar React untuk Pemula", content: "Mulai dengan komponen..." },

    { authorId: 6, categoryId: 3, title: "Belajar Cepat dengan Mindmap", content: "Visualisasi materi..." },
    { authorId: 7, categoryId: 4, title: "Tempat Makan Murah di Jakarta", content: "Warung makan legend..." },
    { authorId: 8, categoryId: 1, title: "Apa Itu Blockchain", content: "Blockchain adalah teknologi..." },
    { authorId: 9, categoryId: 2, title: "Menjaga Mood Harian", content: "Awali hari dengan gratitude..." },
    { authorId: 10, categoryId: 5, title: "Latihan Kardio di Rumah", content: "Skipping dan burpee efektif..." }
  ];

  // Initialize comments data
  const comments = [
    { authorId: 2, postId: 1, content: "Artikel ini sangat informatif!" },
    { authorId: 3, postId: 1, content: "AI memang masa depan." },
    { authorId: 1, postId: 2, content: "Saya setuju, hidup minimalis itu penting." },
    { authorId: 4, postId: 3, content: "Metode bagus buat belajar." },
    { authorId: 5, postId: 4, content: "Resepnya mudah, terima kasih!" },

    { authorId: 6, postId: 5, content: "Saya akan coba besok." },
    { authorId: 7, postId: 6, content: "Cloud computing membantu bisnis saya." },
    { authorId: 8, postId: 7, content: "Self care itu penting banget." },
    { authorId: 9, postId: 8, content: "Ini membantu mahasiswa." },
    { authorId: 10, postId: 9, content: "Saya suka street food!" },

    { authorId: 3, postId: 10, content: "Jogging bikin mood bagus." },
    { authorId: 6, postId: 11, content: "Aku coba rutinitas ini." },
    { authorId: 1, postId: 12, content: "Aku juga lagi belajar bahasa baru!" },
    { authorId: 2, postId: 13, content: "Bandung memang surganya kuliner." },
    { authorId: 4, postId: 14, content: "Terima kasih tipsnya." }
  ];

  // Create users data for seeding
  for (const user of users) {
    await prismaClient.user.create({ data: user });
  }

  // Create categories data for seeding
  for (const category of categories) {
    await prismaClient.category.create({ data: category });
  }

  // Create posts data for seeding
  for (const post of posts) {
    await prismaClient.post.create({ data: post });
  }

  // Create comments data for seeding
  for (const comment of comments) {
    await prismaClient.comment.create({ data: comment });
  }
}

main()
  .then(() => {
    console.log('Seeding completed');
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
