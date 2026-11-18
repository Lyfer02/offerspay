import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { colors } from "../../src/utils/color";
import defaultStyleSheet from "../../src/styles/defaultStylesSheet";
import NoDataFound from "../NoDataFound/NoDataFound";
import IconComponent from "../IconComponent";
import { walletHistory } from "../../api/services/walletHistory.service";
import DateFilterModal from "../DateFilterComponent";
import { ErrorModalService } from "../../src/utils/modalService";
import { ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import RNFS from "react-native-fs";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const isLargeScreen = width > 768;

const EarningsReport = () => {
  const [showEarningDescription, setShowEarningDescription] = useState(false);

  // GLOBAL STATS (not affected by date filters)
  const [stats, setStats] = useState({
    redeemedAmount: 0,
    redeemableAmount: 0,
    totalEarnings: 0,
    pendingAmount: 0,
  });

  // Transaction list (filtered)
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // DATE FILTER STATES
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const prettyDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  /* -------------------------------------------------------
      Fetch GLOBAL STATS (runs once)
  --------------------------------------------------------- */
  const fetchStats = useCallback(async () => {
    try {
      const res = await walletHistory.walletBalance();
    //  console.log("this is response",res);
      
      const  statistics  = res.data.data;
    //  console.log("this is stats",statistics);
      
      setStats({
        redeemedAmount: statistics.total_withdrawn || 0,
    redeemableAmount: statistics.available_for_withdrawal || 0,
    totalEarnings: statistics.total_earned || 0,
    pendingAmount: statistics.pending_balance || 0,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load stats";
      ErrorModalService.error(msg);
    }
  }, []);

  /* -------------------------------------------------------
      Fetch transactions with date filters
  --------------------------------------------------------- */
  const fetchHistory = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);

      try {
        const res = await walletHistory.list({
          page: reset ? 1 : page,
          fromDate: formatDate(fromDate),
          toDate: formatDate(toDate),
        });

        console.log("this is walletHistory", res.data.data);
        

        const { results, pagination } = res.data.data;

        setList((prev) => (reset ? results : [...prev, ...results]));

        setHasMore(pagination.hasNextPage);

        if (!reset) setPage((p) => p + 1);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to load earnings";
        ErrorModalService.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, fromDate, toDate]
  );

  /* -------------------------------------------------------
      INITIAL LOAD
  --------------------------------------------------------- */
  useEffect(() => {
    fetchStats();
    fetchHistory(true);
  }, [fetchHistory, fetchStats]);

  /* -------------------------------------------------------
      Apply date filter
  --------------------------------------------------------- */
  const handleDateApply = () => {
    setShowDateFilter(false);
    setPage(1);
    fetchHistory(true);
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 30
    ) {
      if (hasMore && !loading) fetchHistory();
    }
  };

  /* -------------------------------------------------------
      Export Excel
  --------------------------------------------------------- */
  const exportExcel = async () => {
    try {
      const res = await walletHistory.export({
        responseType: "arraybuffer",
      });

      const fileName = `wallet_history_${new Date()
        .toISOString()
        .split("T")[0]}.xlsx`;

      if (isWeb) {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
        return;
      }

      const downloadPath =
        Platform.OS === "android"
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;

      const filePath = `${downloadPath}/${fileName}`;

      const bytes = new Uint8Array(res.data);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      const base64Data = btoa(binary);

      await RNFS.writeFile(filePath, base64Data, "base64");

      ErrorModalService.success(`Exported to:\n${filePath}`);
    } catch (err) {
      console.log(err);
      ErrorModalService.error("Export failed");
    }
  };

  /* -------------------------------------------------------
      Render Transaction Card
  --------------------------------------------------------- */
  const renderTransactionCard = (item, index) => (
    <View
      key={index}
      style={[
        styles.card,
        defaultStyleSheet.shadowProvider,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <IconComponent
            name="calendar"
            size={16}
            color={colors.colorPrimary}
            family="ionicons"
          />
          <Text style={styles.cardDate}>
            {new Date(item.updatedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.coinsBadge}>
          <Text style={styles.coinsText}>
            ₹{item.amount?.toFixed(2) ?? "0.00"}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBody}>
        <View style={styles.offerRow}>
          <IconComponent
            name="gift"
            size={16}
            color={colors.colorPrimary}
            family="fontawesome"
          />
          <Text style={styles.offerLabel}>Offer:</Text>
          <Text style={styles.offerName} numberOfLines={2}>
            {item.message || "Default"}
          </Text>
        </View>

        {item.message && (
          <View style={styles.messageRow}>
            <IconComponent
              name="information-circle"
              size={16}
              color={colors.gray}
              family="ionicons"
            />
            <Text style={styles.messageText} numberOfLines={3}>
              {item.message}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  /* -------------------------------------------------------
      UI STARTS
  --------------------------------------------------------- */

  return (
    <>
      {/* DATE FILTER MODAL */}
      <DateFilterModal
        isVisible={showDateFilter}
        onClose={() => setShowDateFilter(false)}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onApply={handleDateApply}
        formatDate={prettyDate}
      />

      <ScrollView
        style={styles.container}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* IMPORTANT NOTE */}
        {/* <View style={styles.noteRow}>
          <IconComponent
            name="exclamation-circle"
            color={colors.colorPrimary}
            size={18}
            family="fontawesome"
          />
          <Text style={styles.noteText}>Minimum redeemable amount:</Text>
          <Text style={styles.noteBold}> ₹99.00</Text>
        </View> */}

        {/* GST INFO BOX */}
        <View style={[styles.infoBox, defaultStyleSheet.shadowProvider]}>
          <TouchableHighlight
            onPress={() => setShowEarningDescription(!showEarningDescription)}
            underlayColor="#f0f0f0"
            style={styles.infoTouchable}
          >
            <View style={styles.infoHeader}>
              <IconComponent
                name="information-circle"
                size={20}
                color={colors.colorPrimary}
                family="ionicons"
              />
              <Text allowFontScaling={false} style={styles.infoText}>
                GST Invoice Information
              </Text>
              <IconComponent
                size={24}
                name={
                  showEarningDescription ? "chevron-up" : "chevron-down"
                }
                color={colors.colorPrimary}
                family="ionicons"
              />
            </View>
          </TouchableHighlight>

          {showEarningDescription && (
            <View style={styles.gstDetails}>
              <Text  
              
      allowFontScaling={false}
      style={styles.gstText}>Netify Technologies Pvt. Ltd.</Text>
              <Text 
      allowFontScaling={false}
      style={styles.gstText}>ID: U72200KA2014PTC077515</Text>
              <Text 
      allowFontScaling={false}
       style={styles.gstText}>HSR Layout, Bengaluru - 561020</Text>
              <Text
      allowFontScaling={false}
       style={styles.gstText}>GSTIN: 29AAECN7895JIZM</Text>
            </View>
          )}
        </View>

        {/* === GLOBAL STATS GRID === */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, defaultStyleSheet.shadowProvider]}>
            <IconComponent
              name="checkmark-circle-sharp"
              size={32}
              color={colors.colorPrimaryLite}
              family="ionicons"
            />
            <Text
            
      allowFontScaling={false}
            style={styles.statLabel}>Redeemed Amount</Text>
            <Text
            
      allowFontScaling={false} style={styles.statValue}>₹{stats.redeemedAmount.toFixed(2)}</Text>
          </View>

          <View style={[styles.statCard, styles.statCardHighlight, defaultStyleSheet.shadowProvider]}>
            <IconComponent
              name="wallet"
              size={32}
              color={colors.colorPrimary}
              family="ionicons"
            />
            <Text 
            
      allowFontScaling={false}
      style={styles.statLabel}>Redeemable Amount</Text>
            <Text 
      allowFontScaling={false} style={[styles.statValue, styles.statValuePrimary]}>
              ₹{stats.redeemableAmount.toFixed(2)}
            </Text>

            <LinearGradient 
            colors={[colors.colorPrimaryLite, colors.colorPrimary]}
            style={{    paddingHorizontal: 20,
              paddingVertical: 8, borderRadius:8}}
            >
            <TouchableOpacity 
            activeOpacity={0.8}
            onPress={()=>{ErrorModalService.warning("This feature is not available yet")}}
            style={{alignItems:'center',justifyContent:'center' }} underlayColor="#0056b3">
              <Text allowFontScaling={false} style={styles.redeemBtnText}>Redeem Now</Text>
            </TouchableOpacity>
            </LinearGradient>


          </View>

          <View style={[styles.statCard, defaultStyleSheet.shadowProvider]}>
            <IconComponent
              name="trending-up"
              size={32}
              color="#FF9800"
              family="ionicons"
            />
            <Text 
      allowFontScaling={false} style={styles.statLabel}>Total Earnings</Text>
            <Text 
      allowFontScaling={false} style={styles.statValue}>₹{stats.totalEarnings.toFixed(2)}</Text>
          </View>

          <View style={[styles.statCard, defaultStyleSheet.shadowProvider]}>
            <IconComponent
              name="time"
              size={32}
              color="#2196F3"
              family="ionicons"
            />
            <Text 
      allowFontScaling={false} style={styles.statLabel}>Pending Amount</Text>
            <Text 
      allowFontScaling={false} style={styles.statValue}>₹{stats.pendingAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* === DATE FILTER + EXPORT HEADER === */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.dateFilterBtn}
              onPress={() => setShowDateFilter(true)}
            >
              <IconComponent
                name="calendar"
                size={18}
                color={colors.colorPrimary}
                family="ionicons"
              />
              <Text allowFontScaling={false} style={styles.dateFilterText}>
                {prettyDate(fromDate)} - {prettyDate(toDate)}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.exportBtn} onPress={exportExcel}>
              <IconComponent
                name="download"
                size={20}
                color="#4CAF50"
                family="material"
              />
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* === TRANSACTION LIST/GRID === */}
        {list.length === 0 && !loading ? (
          <ScrollView
          showsVerticalScrollIndicator={false}
          ><NoDataFound /></ScrollView>
        ) : (
          <View style={styles.transactionsContainer}>
            {isWeb && isLargeScreen ? (
              // Grid layout for web
              <View style={styles.transactionsGrid}>
                {list.map((item, idx) => (
                  <View key={idx} style={styles.gridItem}>
                    {renderTransactionCard(item, idx)}
                  </View>
                ))}
              </View>
            ) : (
              // Stack layout for mobile
              list.map((item, idx) => renderTransactionCard(item, idx))
            )}
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.colorPrimary} />
            <Text allowFontScaling={false} style={styles.loadingText}>Loading transactions...</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default EarningsReport;

/* -------------------------------------------------------
      STYLES
--------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    padding: isWeb && isLargeScreen ? 20 : 12,
    paddingBottom: 30,
    flex:1,
    backgroundColor:colors.white,
  },

  // Note Row
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  noteText: {
    fontSize: 13,
    paddingHorizontal: 8,
    color: "#856404",
  },
  noteBold: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#856404",
  },

  // Info Box
  infoBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  infoTouchable: {
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical:8
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
    marginLeft: 10,
  },
  gstDetails: {
    paddingHorizontal: 15,
    paddingBottom: 8,
    paddingTop: 5,
    backgroundColor: "#F8F9FA",
  },
  gstText: {
    fontSize: 12,
    color: colors.gray,
    marginVertical: 2,
  },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth:1,
    borderColor:colors.gray,
    width: isWeb && isLargeScreen ? "24%" : "48%",
    marginBottom: 12,
  },
  statCardHighlight: {
    borderWidth: 2,
    borderColor: colors.colorPrimary,
    backgroundColor: "#F0F7FF",
  },
  statLabel: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
    marginTop: 4,
  },
  statValuePrimary: {
    color: colors.colorPrimary,
  },
  redeemBtn: {

    borderRadius: 6,
    marginTop: 10,
  },
  redeemBtnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 12,
  },

  // Section Header
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dateFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#B3D9FF",
    marginRight: 10,
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.colorPrimary,
    marginLeft: 8,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  exportText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4CAF50",
    marginLeft: 6,
  },

  // Transactions Container
  transactionsContainer: {
    width: "100%",
  },
  transactionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: isWeb && isLargeScreen ? "49%" : "100%",
    marginBottom: 12,
  },

  // Transaction Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#495057",
    marginLeft: 6,
  },
  coinsBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E9ECEF",
    marginBottom: 12,
  },
  cardBody: {
  },
  offerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  offerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6C757D",
    marginLeft: 8,
    marginRight: 6,
  },
  offerName: {
    flex: 1,
    fontSize: 13,
    color: "#212529",
    fontWeight: "500",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 6,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    color: "#6C757D",
    lineHeight: 18,
    marginLeft: 8,
  },

  // Loading
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: "#6C757D",
  },
});