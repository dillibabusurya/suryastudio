/**
 * SURYA STUDIO - Database Configuration & Enquiries Handler
 * Uses Supabase (Free PostgreSQL Cloud Database) + LocalStorage Fallback
 */

// ---------------------------------------------------------------------------
// 1. SUPABASE CREDENTIALS (PASTE YOUR SUPABASE KEYS HERE)
// Create free account at https://supabase.com -> New Project -> Project Settings -> API
// ---------------------------------------------------------------------------
const SUPABASE_CONFIG = {
  url: "https://kwzwptftasyvywzgnlxm.supabase.co",
  anonKey: "sb_publishable_vM27heAc9hrIUB7VjjkhWA_POptknYc"
};

// Initialize Supabase Client if library and valid config are present
let supabaseClient = null;
if (window.supabase && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.includes("YOUR_PROJECT_ID")) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log("✅ Supabase Database Connected Successfully to Surya Studio");
  } catch (err) {
    console.warn("Supabase initialization error, falling back to local storage:", err);
  }
}

// ---------------------------------------------------------------------------
// 2. SAVE ENQUIRY FUNCTION (CALLED ON BOOKING FORM SUBMISSION)
// ---------------------------------------------------------------------------
async function saveEnquiryToDatabase(enquiryData) {
  const newEnquiry = {
    id: "enq_" + Date.now(),
    name: enquiryData.name,
    phone: enquiryData.phone,
    service: enquiryData.service,
    event_date: enquiryData.event_date || "Flexible / Not specified",
    message: enquiryData.message || "",
    status: "New",
    created_at: new Date().toISOString()
  };

  // Always save to LocalStorage so no enquiry is EVER lost
  saveToLocalStorage(newEnquiry);

  // If Supabase is connected, also save to cloud database
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('enquiries')
        .insert([{
          name: newEnquiry.name,
          phone: newEnquiry.phone,
          service: newEnquiry.service,
          event_date: newEnquiry.event_date,
          message: newEnquiry.message,
          status: newEnquiry.status
        }]);

      if (error) {
        console.warn("Supabase insert error (table might need creation):", error);
      } else {
        console.log("Enquiry saved to Supabase Cloud Database:", data);
      }
    } catch (e) {
      console.warn("Supabase network error:", e);
    }
  }

  return newEnquiry;
}

// ---------------------------------------------------------------------------
// 3. FETCH ALL ENQUIRIES (FOR ADMIN DASHBOARD)
// ---------------------------------------------------------------------------
async function fetchAllEnquiries() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Could not fetch from Supabase, loading local enquiries:", e);
    }
  }

  // Fallback to local storage
  return getFromLocalStorage();
}

// ---------------------------------------------------------------------------
// 4. DELETE & UPDATE STATUS
// ---------------------------------------------------------------------------
async function deleteEnquiryFromDB(id) {
  deleteFromLocalStorage(id);
  if (supabaseClient) {
    try {
      await supabaseClient.from('enquiries').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase delete error:", e);
    }
  }
}

async function updateEnquiryStatusInDB(id, newStatus) {
  updateStatusInLocalStorage(id, newStatus);
  if (supabaseClient) {
    try {
      await supabaseClient.from('enquiries').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.warn("Supabase update error:", e);
    }
  }
}

// ---------------------------------------------------------------------------
// LOCAL STORAGE HELPER FUNCTIONS (INSTANT ZERO-CONFIG STORAGE)
// ---------------------------------------------------------------------------
const STORAGE_KEY = "surya_studio_enquiries";

function getFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveToLocalStorage(enquiry) {
  try {
    const list = getFromLocalStorage();
    list.unshift(enquiry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Local storage save error:", e);
  }
}

function deleteFromLocalStorage(id) {
  try {
    let list = getFromLocalStorage();
    list = list.filter(item => item.id !== id && String(item.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

function updateStatusInLocalStorage(id, status) {
  try {
    const list = getFromLocalStorage();
    const item = list.find(i => i.id === id || String(i.id) === String(id));
    if (item) {
      item.status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch (e) {}
}

