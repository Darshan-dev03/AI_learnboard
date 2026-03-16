import { Bell, BookOpen, ClipboardList, CreditCard, Trophy, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/lib/hooks/useDashboard";

const typeIcon: Record<string, any> = {
  quiz: { icon: ClipboardList, color: "text-purple-400 bg-purple-400/10" },
  course: { icon: BookOpen, color: "text-blue-400 bg-blue-400/10" },
  achievement: { icon: Trophy, color: "text-yellow-400 bg-yellow-400/10" },
  payment: { icon: CreditCard, color: "text-green-400 bg-green-400/10" },
};

const Notifications = ({ user }: { user: any }) => {
  const { notifications, loading, markAllRead } = useNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your learning activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> All Notifications
            {unreadCount > 0 && (
              <Badge className="gradient-primary text-primary-foreground border-0 text-xs ml-1">{unreadCount} new</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No notifications yet.</p>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map(n => {
                const t = typeIcon[n.type] || typeIcon.course;
                const Icon = t.icon;
                return (
                  <div key={n.id} className={`flex items-start gap-4 py-4 ${n.is_read ? "opacity-60" : ""}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{n.title}</p>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      {n.description && <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
