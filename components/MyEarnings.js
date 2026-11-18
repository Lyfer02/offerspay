// MyEarningsTab.js
import React from 'react';
import TabContainer from './TabContainer';
import EarningsReport from './MyEarningsTab/EarningsReport';
import StoreProductsDetails from './MyEarningsTab/StoreProductsDetails';
import ManageBankDetails from './MyEarningsTab/ManageBankDetails';
import RedeemHistory from './MyEarningsTab/RedeemHistory';
import AllInvoices from './MyEarningsTab/AllInvoices';
import { SafeAreaView } from 'react-native-safe-area-context';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';

const MyEarningsTab = () => {
  const tabs = [
    { 
      name: 'EarningsReport', 
      label: 'Earning Report', 
      component: () => <EarningsReport /> 
    },
    // { 
    //   name: 'StoreProductDetails', 
    //   label: 'Store Product Detail', 
    //   component: () => <StoreProductsDetails /> 
    // },
    // { 
    //   name: 'ManageBankDetails', 
    //   label: 'Manage Bank Details', 
    //   component: () => <ManageBankDetails /> 
    // },
    // { 
    //   name: 'RedeemHistory', 
    //   label: 'Redeem History', 
    //   component: () => <RedeemHistory /> 
    // },
    // { 
    //   name: 'AllInvoices', 
    //   label: 'All Invoices', 
    //   component: () => <AllInvoices /> 
    // },
  ];

  return (
    <SafeAreaView style={defaultStyleSheet.safeArea}> 
    <TabContainer
      tabs={tabs}
      initialTab="EarningsReport"
      onTabChange={(tabName) => console.log('Tab changed to:', tabName)}
    />
    </SafeAreaView>
  );
};

export default MyEarningsTab;