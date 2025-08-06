import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Building2, 
  Settings,
  Plus,
  Trash2,
  Eye, 
  Search, 
  Filter, 
  MoreHorizontal,
  Activity,
  Bell,
  Home,
  Sun,
  Moon,
  Power,
  PowerOff,
  UserPlus,
  UserMinus,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  Database,
  Server,
  Zap,
  FileText,
  Shield as ShieldCheck,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Types for Admin Management
interface User {
  id: string;
  address: string;
  name: string;
  email: string;
  role: 'issuer' | 'manager';
  status: 'active' | 'inactive' | 'pending';
  metadataURI: string;
  joinedDate: string;
  lastActive: string;
  tokensManaged?: number;
  totalVolume?: number;
}

interface SystemMetrics {
  totalIssuers: number;
  totalManagers: number;
  activeTokens: number;
  totalVolume: number;
  marketplaceStatus: boolean;
  platformFees: number;
}

const Admin: React.FC = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Main state
  const [activeTab, setActiveTab] = useState('overview');
  const [issuers, setIssuers] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalIssuers: 0,
    totalManagers: 0,
    activeTokens: 0,
    totalVolume: 0,
    marketplaceStatus: true,
    platformFees: 0
  });
  
  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
  const [showRemoveUserDialog, setShowRemoveUserDialog] = useState(false);
  
  // Form states
  const [userForm, setUserForm] = useState({
    address: '',
    name: '',
    email: '',
    role: 'issuer' as 'issuer' | 'manager',
    metadataURI: ''
  });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [marketplacePaused, setMarketplacePaused] = useState(false);

  // Demo data initialization
  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    const demoIssuers: User[] = [
      {
        id: '1',
        address: '0x1234567890123456789012345678901234567890',
        name: 'Manhattan Real Estate Corp',
        email: 'admin@manhattanre.com',
        role: 'issuer',
        status: 'active',
        metadataURI: 'ipfs://QmExample1',
        joinedDate: '2024-01-15',
        lastActive: '2024-12-20',
        tokensManaged: 5,
        totalVolume: 12500000
      },
      {
        id: '2',
        address: '0x2345678901234567890123456789012345678901',
        name: 'Global Commodities Ltd',
        email: 'issuer@globalcom.com',
        role: 'issuer',
        status: 'active',
        metadataURI: 'ipfs://QmExample2',
        joinedDate: '2024-02-20',
        lastActive: '2024-12-19',
        tokensManaged: 3,
        totalVolume: 8500000
      }
    ];

    const demoManagers: User[] = [
      {
        id: '3',
        address: '0x3456789012345678901234567890123456789012',
        name: 'John Smith',
        email: 'john.smith@realestate.com',
        role: 'manager',
        status: 'active',
        metadataURI: 'ipfs://QmExample3',
        joinedDate: '2024-03-10',
        lastActive: '2024-12-20',
        tokensManaged: 3,
        totalVolume: 450000
      },
      {
        id: '4',
        address: '0x4567890123456789012345678901234567890123',
        name: 'Sarah Johnson',
        email: 'sarah.j@propmanage.com',
        role: 'manager',
        status: 'active',
        metadataURI: 'ipfs://QmExample4',
        joinedDate: '2024-04-05',
        lastActive: '2024-12-18',
        tokensManaged: 2,
        totalVolume: 280000
      }
    ];

    setIssuers(demoIssuers);
    setManagers(demoManagers);
    setSystemMetrics({
      totalIssuers: demoIssuers.length,
      totalManagers: demoManagers.length,
      activeTokens: 8,
      totalVolume: 21730000,
      marketplaceStatus: !marketplacePaused,
      platformFees: 125000
    });
  };

  const handleAddUser = async () => {
    if (!userForm.address || !userForm.name || !userForm.email) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Demo submission - in production, this would call the Admin contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: Date.now().toString(),
        address: userForm.address,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: 'active',
        metadataURI: userForm.metadataURI || `ipfs://QmExample${Date.now()}`,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        tokensManaged: 0,
        totalVolume: 0
      };
      
      if (userForm.role === 'issuer') {
        setIssuers(prev => [...prev, newUser]);
        setSystemMetrics(prev => ({ ...prev, totalIssuers: prev.totalIssuers + 1 }));
      } else {
        setManagers(prev => [...prev, newUser]);
        setSystemMetrics(prev => ({ ...prev, totalManagers: prev.totalManagers + 1 }));
      }
      
      setShowAddUserDialog(false);
      setUserForm({
        address: '',
        name: '',
        email: '',
        role: 'issuer',
        metadataURI: ''
      });
      
      toast.success(`${userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1)} added successfully!`);
      
    } catch (error) {
      toast.error('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedUser.role === 'issuer') {
        setIssuers(prev => prev.filter(issuer => issuer.id !== selectedUser.id));
        setSystemMetrics(prev => ({ ...prev, totalIssuers: prev.totalIssuers - 1 }));
      } else {
        setManagers(prev => prev.filter(manager => manager.id !== selectedUser.id));
        setSystemMetrics(prev => ({ ...prev, totalManagers: prev.totalManagers - 1 }));
      }
      
      setShowRemoveUserDialog(false);
      setSelectedUser(null);
      
      toast.success(`${selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)} removed successfully!`);
      
    } catch (error) {
      toast.error('Failed to remove user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMarketplace = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMarketplacePaused(!marketplacePaused);
      setSystemMetrics(prev => ({ ...prev, marketplaceStatus: marketplacePaused }));
      
      toast.success(marketplacePaused ? 'Marketplace resumed' : 'Marketplace paused');
      
    } catch (error) {
      toast.error('Failed to toggle marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Professional Header */}
      <header className={`${isDarkMode ? 'bg-slate-800/95 backdrop-blur-md border-slate-700/50' : 'bg-white/95 backdrop-blur-md border-slate-200/60'} border-b sticky top-0 z-50 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Administration Console</h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Platform Management & Control</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Professional Status Indicator */}
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium ${
                marketplacePaused 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              } ${isDarkMode && (marketplacePaused ? 'bg-red-900/20 text-red-400 border-red-800/30' : 'bg-emerald-900/20 text-emerald-400 border-emerald-800/30')}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${marketplacePaused ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                <span>{marketplacePaused ? 'Trading Suspended' : 'System Operational'}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} h-8 w-8 p-0`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              <Button variant="ghost" size="sm" className={`${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} h-8 w-8 p-0`}>
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button asChild variant="ghost" size="sm" className={`${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                <Link to="/" className="flex items-center space-x-2 px-3 py-1.5">
                  <Home className="w-4 h-4" />
                  <span className="text-sm">Home</span>
                </Link>
              </Button>
              
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
              
              <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Professional Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className={`inline-flex h-10 items-center justify-center rounded-lg p-1 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="issuers" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
              Issuers
            </TabsTrigger>
            <TabsTrigger value="managers" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
              Managers
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
              System
            </TabsTrigger>
          </TabsList>

          {/* Professional Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Executive Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Issuers</p>
                      <p className={`text-2xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{systemMetrics.totalIssuers}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">+2 this month</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Building2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Property Managers</p>
                      <p className={`text-2xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{systemMetrics.totalManagers}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">+1 this month</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Users className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Tokens</p>
                      <p className={`text-2xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{systemMetrics.activeTokens}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">+3 this week</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Zap className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Volume</p>
                      <p className={`text-2xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${(systemMetrics.totalVolume / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">+$2.1M this month</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Professional Action Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm`}>
                  <CardHeader className="pb-4">
                    <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Administrative Actions</CardTitle>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage platform users and system settings</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => setShowAddUserDialog(true)}
                        className="h-20 flex-col space-y-2 bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <UserPlus className="w-5 h-5" />
                        <span className="text-sm font-medium">Add User</span>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className={`h-20 flex-col space-y-2 ${isDarkMode ? 'border-slate-700 bg-slate-800/30 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">Audit Logs</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`h-20 flex-col space-y-2 ${isDarkMode ? 'border-slate-700 bg-slate-800/30 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-sm font-medium">Fee Management</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`h-20 flex-col space-y-2 ${isDarkMode ? 'border-slate-700 bg-slate-800/30 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <Briefcase className="w-5 h-5" />
                        <span className="text-sm font-medium">Asset Registry</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm`}>
                  <CardHeader className="pb-4">
                    <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${marketplacePaused ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Trading Engine</span>
                      </div>
                      <Badge variant={marketplacePaused ? 'destructive' : 'default'} className="text-xs">
                        {marketplacePaused ? 'Paused' : 'Active'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Smart Contracts</span>
                      </div>
                      <Badge variant="default" className="text-xs">Deployed</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Infrastructure</span>
                      </div>
                      <Badge variant="default" className="text-xs">Healthy</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Professional Issuers Tab */}
          <TabsContent value="issuers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Platform Issuers</h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage tokenization partners and authorized issuers</p>
              </div>
              <Button 
                onClick={() => { setUserForm(prev => ({ ...prev, role: 'issuer' })); setShowAddUserDialog(true); }}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Issuer
              </Button>
            </div>

            <div className="space-y-4">
              {issuers.map((issuer) => (
                <Card key={issuer.id} className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-all duration-200`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-11 w-11 border border-slate-200 dark:border-slate-700">
                          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {issuer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{issuer.name}</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{issuer.email}</p>
                          <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            {issuer.address.slice(0, 8)}...{issuer.address.slice(-6)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-right space-y-1">
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {issuer.tokensManaged} Active Tokens
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            ${(issuer.totalVolume! / 1000000).toFixed(1)}M Total Volume
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${issuer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                          <Badge 
                            variant={issuer.status === 'active' ? 'default' : 'secondary'} 
                            className="text-xs font-medium"
                          >
                            {issuer.status}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedUser(issuer);
                              setShowUserDetailsDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                            onClick={() => {
                              setSelectedUser(issuer);
                              setShowRemoveUserDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Professional Managers Tab */}
          <TabsContent value="managers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Managers</h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage asset managers and property supervisors</p>
              </div>
              <Button 
                onClick={() => { setUserForm(prev => ({ ...prev, role: 'manager' })); setShowAddUserDialog(true); }}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Manager
              </Button>
            </div>

            <div className="space-y-4">
              {managers.map((manager) => (
                <Card key={manager.id} className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-all duration-200`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-11 w-11 border border-slate-200 dark:border-slate-700">
                          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {manager.name.split(' ').map(n => n.charAt(0)).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{manager.name}</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{manager.email}</p>
                          <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            {manager.address.slice(0, 8)}...{manager.address.slice(-6)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-right space-y-1">
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {manager.tokensManaged} Managed Assets
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            ${manager.totalVolume!.toLocaleString()} Monthly Income
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${manager.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                          <Badge 
                            variant={manager.status === 'active' ? 'default' : 'secondary'} 
                            className="text-xs font-medium"
                          >
                            {manager.status}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedUser(manager);
                              setShowUserDetailsDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                            onClick={() => {
                              setSelectedUser(manager);
                              setShowRemoveUserDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Professional System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Administration</h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Configure platform settings and monitor system health</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Trading Controls</CardTitle>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Manage marketplace operations</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Marketplace Status</p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {marketplacePaused ? 'All trading operations are currently suspended' : 'Trading operations are active and functioning normally'}
                      </p>
                    </div>
                    <Switch 
                      checked={!marketplacePaused}
                      onCheckedChange={handleToggleMarketplace}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button 
                      onClick={handleToggleMarketplace}
                      disabled={isLoading}
                      className="w-full"
                      variant={marketplacePaused ? "default" : "destructive"}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {marketplacePaused ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                          {marketplacePaused ? 'Resume Trading' : 'Suspend Trading'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} shadow-sm`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Platform Configuration</CardTitle>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>System settings and administration tools</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Settings className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Fee Structure</div>
                      <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Configure platform fees and commissions</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Download className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Export Logs</div>
                      <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Download system logs and audit trails</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start h-12">
                    <BarChart3 className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Analytics Dashboard</div>
                      <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>View detailed platform analytics</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Professional Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className={`sm:max-w-md ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-xl`}>
          <DialogHeader className="space-y-3">
            <DialogTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Add {userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1)}
            </DialogTitle>
            <DialogDescription className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Grant platform access to a new {userForm.role} with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role" className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>User Role</Label>
              <Select 
                value={userForm.role} 
                onValueChange={(value: 'issuer' | 'manager') => 
                  setUserForm(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issuer">Platform Issuer</SelectItem>
                  <SelectItem value="manager">Property Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Wallet Address</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={userForm.address}
                onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-300'} font-mono text-sm`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Display Name</Label>
              <Input
                id="name"
                placeholder="Organization or individual name"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-300'}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@organization.com"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-300'}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata" className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Metadata URI <span className="text-xs text-slate-500">(Optional)</span></Label>
              <Input
                id="metadata"
                placeholder="ipfs://..."
                value={userForm.metadataURI}
                onChange={(e) => setUserForm(prev => ({ ...prev, metadataURI: e.target.value }))}
                className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-300'} font-mono text-sm`}
              />
            </div>
          </div>

          <DialogFooter className="space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isLoading} className="bg-slate-900 hover:bg-slate-800">
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1)}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetailsDialog} onOpenChange={setShowUserDetailsDialog}>
        <DialogContent className={`sm:max-w-2xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedUser.name}
                </DialogTitle>
                <DialogDescription className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)} Details
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wallet Address</p>
                    <p className={`font-mono text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.address}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                    <Badge variant={selectedUser.status === 'active' ? 'default' : 'secondary'}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Joined Date</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.joinedDate}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Active</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.lastActive}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedUser.role === 'issuer' ? 'Tokens Created' : 'Assets Managed'}
                    </p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.tokensManaged}</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUserDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Professional Remove User Confirmation Dialog */}
      <Dialog open={showRemoveUserDialog} onOpenChange={setShowRemoveUserDialog}>
        <DialogContent className={`sm:max-w-md ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-xl`}>
          {selectedUser && (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <DialogTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Confirm Removal
                    </DialogTitle>
                    <DialogDescription className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      This action will revoke all platform permissions
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'} border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    You are about to remove <span className="font-medium">{selectedUser.name}</span> from the platform.
                  </p>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Role: <span className="capitalize font-medium">{selectedUser.role}</span>
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Address: <span className="font-mono">{selectedUser.address}</span>
                  </p>
                  <div className={`mt-3 p-3 rounded ${isDarkMode ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                      ⚠️ This action cannot be undone. All associated permissions will be permanently revoked.
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="space-x-2">
                <Button variant="outline" onClick={() => setShowRemoveUserDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleRemoveUser} 
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <UserMinus className="w-4 h-4 mr-2" />
                      Remove User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;