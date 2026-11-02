# Aydınlat (Türkçe)

Aydınlat, kodlama ajanınızın (Codex, Claude Code, Cursor, Gemini CLI, Antigravity) bir görev için kurulu skill, eklenti ve araçlardan yalnızca gerekenleri seçmesini sağlar ve çıktıyı kısa tutarak token harcamasını azaltır. Ayrıntılar için [README.md](README.md).

## Kurulum

Node.js 18+ gerekir. Algılanan ajanlar önceden işaretli gelir:

```bash
npx -y github:ayanoglunorth/aydinlat
```

Etkileşimsiz:

```bash
npx -y github:ayanoglunorth/aydinlat --agent claude-code,codex --with ponytail,caveman --yes
```

Durum kontrolü: `--doctor`. Güncelleme: `--update`. Sadece komutları görmek: `--dry-run`.

## Kullanım

```text
$aydinlat Bu çeyrek raporu için şık bir sunum hazırla.
```

Kapatmak için `Aydınlat'ı kapat`. Caveman kuruluysa yanıtlar kısa kalır; güvenlik uyarıları, kod, commit mesajı ve silme onayları tam cümleyle yazılır. `lite` veya `ultra` isteyerek seviyeyi değiştirebilirsiniz.

## Sorun giderme

- `EALLOWGIT`: `npx --allow-git=root -y github:ayanoglunorth/aydinlat`
- `cli not found`: ajanın komutu PATH'te yok; yeni terminal açın.
- `unverified`: komut başarılı ama durum doğrulanamadı; ajanı yeniden başlatıp `--doctor` çalıştırın.
