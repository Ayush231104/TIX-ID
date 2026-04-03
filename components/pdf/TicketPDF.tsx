import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { EnrichedBooking } from '@/section/TicketsPage/TicketsPage'; 

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  
  headerBg: { backgroundColor: '#1A2C50', padding: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  movieTitle: { color: '#F2C96F', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#BDC5D4', fontSize: 10, marginBottom: 4 },
  value: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  
  yellowBg: { backgroundColor: '#F2C96F', padding: 20, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  yellowLabel: { color: '#1A2C50', fontSize: 10, opacity: 0.8 },
  yellowValue: { color: '#1A2C50', fontSize: 14, fontWeight: 'bold' },
  
  purchaseSection: { marginTop: 30, paddingHorizontal: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A2C50', marginBottom: 15 },
  purchaseRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  purchaseLabel: { fontSize: 12, color: '#4A4E62', textTransform: 'uppercase' },
  purchaseValue: { fontSize: 12, color: '#1A2C50' },
  purchaseValueBold: { fontWeight: 'bold' },
  discountText: { color: '#16a34a' },
  divider: { marginVertical: 12, borderBottomWidth: 1, borderBottomColor: '#DADFEB' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#1A2C50' },
  totalValue: { fontSize: 14, fontWeight: 'bold', color: '#1A2C50' }
});

interface TicketPDFProps {
  ticket: EnrichedBooking;
  passwordKey: number;
  seats: string;
}

export default function TicketPDF({ ticket, passwordKey, seats }: TicketPDFProps) {
  const showtime = ticket.showtimes;
  
  // 🚀 Date/Time Formatting
  const date = new Date(showtime.show_time).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const time = new Date(showtime.show_time).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  // 🚀 Purchase Details Math
  const seatCount = ticket.booking_seats.length;
  const seatPrice = showtime.price || 0;
  const serviceFee = 30;
  const discount = ticket.discount_id ? 50 : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* === TICKET SECTION === */}
        <View style={styles.headerBg}>
          <Text style={styles.movieTitle}>{showtime.movies.name}</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{showtime.theater.name}</Text>
            </View>
            <View>
              <Text style={styles.label}>Class</Text>
              <Text style={styles.value}>{showtime.screen.type}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{date}</Text>
            </View>
            <View>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.yellowBg}>
          <View style={styles.row}>
            <Text style={styles.yellowLabel}>Booking Code</Text>
            <Text style={styles.yellowValue}>{ticket.id.split('-')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.yellowLabel}>Password Key</Text>
            <Text style={styles.yellowValue}>{passwordKey}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.yellowLabel}>Seats</Text>
            <Text style={styles.yellowValue}>{seats}</Text>
          </View>
        </View>

        {/* === 🚀 NEW: PURCHASE DETAILS SECTION === */}
        <View style={styles.purchaseSection}>
          <Text style={styles.sectionTitle}>Purchase Details</Text>
          
          <View style={styles.purchaseRow}>
            <Text style={styles.purchaseLabel}>REGULAR SEAT</Text>
            <Text style={styles.purchaseValue}>
              Rs. {seatPrice.toLocaleString('en-IN')} <Text style={styles.purchaseValueBold}>X{seatCount}</Text>
            </Text>
          </View>

          <View style={styles.purchaseRow}>
            <Text style={styles.purchaseLabel}>SERVICE FEE</Text>
            <Text style={styles.purchaseValue}>
              Rs. {serviceFee.toLocaleString('en-IN')} <Text style={styles.purchaseValueBold}>X{seatCount}</Text>
            </Text>
          </View>

          {discount > 0 && (
            <View style={styles.purchaseRow}>
              <Text style={styles.purchaseLabel}>PROMO TIX ID</Text>
              <Text style={[styles.purchaseValue, styles.discountText]}>
                - Rs. {discount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL PAYMENT</Text>
            <Text style={styles.totalValue}>Rs. {ticket.total_amount?.toLocaleString('en-IN')}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}