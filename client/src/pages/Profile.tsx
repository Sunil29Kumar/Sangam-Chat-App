import {
  Camera,
  Mail,
  User,
  Shield,
  Bell,
  Check,
  Edit3,
  Lock,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import {useState} from "react";
import {useAuth} from "../hooks/useAuth";

const Profile = () => {
  const {user} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || "Alex Morgan",
    email: user?.email || "alex.morgan@example.com",
    bio: "Passionate developer & UI/UX enthusiast. Chatting on Sangam!",
  });

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`;
  const handle = `@${formData.name.toLowerCase().replace(/\s+/g, "_")}`;

  return (
    <div className="h-full w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-y-auto border border-white custom-scrollbar">
      {/* ── HERO BANNER ── */}
      <div className="relative h-40 sm:h-52 w-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-400 overflow-hidden rounded-t-[2.5rem]">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute top-10 -right-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 left-1/3 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* ── AVATAR ROW ── */}
      <div className="px-6 sm:px-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16 mb-6 sm:mb-0">
        {/* Avatar + Name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="relative group flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[1.8rem] sm:rounded-[2.5rem] border-4 sm:border-[6px] border-white overflow-hidden bg-slate-100 shadow-xl">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-1.5 sm:p-2 bg-white text-indigo-600 rounded-xl shadow-md hover:scale-110 transition-all border border-indigo-50">
              <Camera size={15} />
            </button>
          </div>

          <div className="mb-1 sm:mb-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {formData.name}
            </h1>
            <p className="text-slate-400 font-semibold text-sm mt-0.5">
              {handle}
            </p>
          </div>
        </div>

        {/* Edit Button — Desktop top-right */}
        <div className="sm:mb-4 flex-shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 border ${
              isEditing
                ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                : "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95"
            }`}
          >
            <Edit3 size={15} />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="mx-6 sm:mx-10 mb-8 mt-2 sm:mt-6 grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
        {[
          {label: "Conversations", value: "48"},
          {label: "Friends", value: "12"},
          {label: "Member since", value: "2024"},
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center py-4 px-2"
          >
            <span className="text-lg sm:text-xl font-black text-slate-900">
              {stat.value}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="px-6 sm:px-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* ── LEFT: Personal Info ── */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="Personal Information"
            icon={<User size={17} className="text-indigo-600" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup label="Full Name">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({...formData, name: e.target.value})
                  }
                  className="field-input"
                />
              </FieldGroup>

              <FieldGroup label="Email Address">
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="field-input pl-11 cursor-not-allowed"
                  />
                </div>
              </FieldGroup>
            </div>

            <FieldGroup label="Bio">
              <textarea
                disabled={!isEditing}
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({...formData, bio: e.target.value})
                }
                className="field-input resize-none"
              />
            </FieldGroup>

            {isEditing && (
              <button className="mt-2 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all w-full sm:w-auto justify-center sm:justify-start">
                <Check size={16} /> Save Changes
              </button>
            )}
          </SectionCard>
        </div>

        {/* ── RIGHT: Security + Notifications ── */}
        <div className="space-y-5">
          <SectionCard
            title="Account Security"
            icon={<Shield size={17} className="text-indigo-600" />}
          >
            <div className="space-y-2">
              <SecurityRow icon={<Lock size={14} />} label="Change Password" />
              <SecurityRow
                icon={<Smartphone size={14} />}
                label="Two-Factor Auth"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Notifications"
            icon={<Bell size={17} className="text-indigo-600" />}
            accent
          >
            <div className="space-y-3">
              <NotifRow
                label="Desktop Alerts"
                enabled={notifEnabled}
                onToggle={() => setNotifEnabled(!notifEnabled)}
              />
              <NotifRow
                label="Message Previews"
                enabled={true}
                onToggle={() => {}}
              />
              <NotifRow label="Sound" enabled={false} onToggle={() => {}} />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Scoped styles */}
      <style>{`
        .field-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: #f8fafc;
          border: 1.5px solid transparent;
          border-radius: 1rem;
          outline: none;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          transition: all 0.2s;
        }
        .field-input:focus {
          border-color: #a5b4fc;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
        }
        .field-input:disabled {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>
    </div>
  );
};

/* ── Sub-components ── */

const SectionCard = ({
  title,
  icon,
  children,
  accent = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <div
    className={`p-5 sm:p-6 rounded-[1.8rem] border space-y-4 ${accent ? "bg-indigo-50/60 border-indigo-100" : "bg-white border-slate-100 shadow-sm"}`}
  >
    <h3
      className={`flex items-center gap-2 text-sm font-bold ${accent ? "text-indigo-900" : "text-slate-800"}`}
    >
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const FieldGroup = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    {children}
  </div>
);

const SecurityRow = ({icon, label}: {icon: React.ReactNode; label: string}) => (
  <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-700 hover:bg-indigo-50/40 transition-all group">
    <span className="flex items-center gap-2.5 text-slate-500 group-hover:text-indigo-600">
      {icon}
      {label}
    </span>
    <ChevronRight
      size={13}
      className="text-slate-300 group-hover:text-indigo-400 transition-colors"
    />
  </button>
);

const NotifRow = ({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-bold text-indigo-800">{label}</span>
    <button
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${enabled ? "bg-indigo-600" : "bg-slate-200"}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${enabled ? "left-5" : "left-0.5"}`}
      />
    </button>
  </div>
);

export default Profile;
