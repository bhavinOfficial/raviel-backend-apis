import db from "../models";
import cron from "node-cron";

const getTodayIST = () => {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  ist.setHours(0, 0, 0, 0);
  return ist;
};

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // Sun=0
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const startOfMonth = (date: Date) => {
  const d = new Date(date);
  d.setDate(1);
  return d;
};

export const partnerFilePlaceholderCron = () => {
  cron.schedule(
    "5 0 * * *", // 12:05 AM
    async () => {
      console.log("🕛 Partner placeholder cron started");

      const today = getTodayIST();

      // 1️⃣ MARK MISSED PLACEHOLDERS
      await db.PartnerExcelFileUploadPlaceholders.update(
        { status: "missed" },
        {
          where: {
            status: "pending",
            expectedDate: {
              [db.Sequelize.Op.lt]: today,
            },
          },
        },
      );

      // 2️⃣ FETCH ALL PARTNERS
      const partners = await db.User.findAll({
        where: {
          role: "partner",
        },
        attributes: ["id"],
      });

      for (const partner of partners) {
        const partnerId = partner.id;

        // =====================
        // DAILY (always)
        // =====================
        await db.PartnerExcelFileUploadPlaceholders.findOrCreate({
          where: {
            partnerId,
            fileType: "daily",
            expectedDate: today,
          },
          defaults: {
            status: "pending",
          },
        });

        // =====================
        // WEEKLY (Monday only)
        // =====================
        if (today.getDay() === 1) {
          const weekStart = startOfWeek(today);

          await db.PartnerExcelFileUploadPlaceholders.findOrCreate({
            where: {
              partnerId,
              fileType: "weekly",
              expectedDate: weekStart,
            },
            defaults: {
              status: "pending",
            },
          });
        }

        // =====================
        // MONTHLY (1st only)
        // =====================
        if (today.getDate() === 1) {
          const monthStart = startOfMonth(today);

          await db.PartnerExcelFileUploadPlaceholders.findOrCreate({
            where: {
              partnerId,
              fileType: "monthly",
              expectedDate: monthStart,
            },
            defaults: {
              status: "pending",
            },
          });
        }
      }

      console.log("✅ Cron finished successfully");
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
};
