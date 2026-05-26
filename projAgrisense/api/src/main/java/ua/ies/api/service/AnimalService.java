package ua.ies.api.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Random;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;

import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import ua.ies.api.dto.AnimalDTO;
import ua.ies.api.dto.AnimalNotesDTO;
import ua.ies.api.dto.DailyMovementDTO;
import ua.ies.api.dto.HeartRateDTO;
import ua.ies.api.dto.MovementDTO;
import ua.ies.api.dto.NotifyVetDTO;
import ua.ies.api.dto.StressDTO;
import ua.ies.api.dto.TemperatureDTO;
import ua.ies.api.dto.VetInfoDTO;
import ua.ies.api.dto.WeeklyWeightDTO;
import ua.ies.api.entity.Animal;
import ua.ies.api.entity.AnimalMetric;
import ua.ies.api.entity.AnimalWeight;
import ua.ies.api.entity.Barn;
import ua.ies.api.repository.AnimalMetricRepository;
import ua.ies.api.repository.AnimalRepository;
import ua.ies.api.repository.AnimalWeightRepository;
import ua.ies.api.repository.BarnRepository;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private static final Logger log = LoggerFactory.getLogger(AnimalService.class);

    private final AnimalMetricRepository metricRepo;
    private final AnimalWeightRepository weightRepo;
    private final AnimalRepository animalRepository;
    private final BarnRepository barnRepository;
    private final JavaMailSender mailSender;

    public List<AnimalDTO> getAllAnimals() {
        return animalRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<AnimalDTO> getAnimalsByBarn(Long barnId) {
        return animalRepository.findByBarnId(barnId).stream().map(this::toDTO).toList();
    }

    public AnimalDTO createAnimal(AnimalDTO dto) {
        Barn barn = barnRepository.findById(dto.barnId())
                .orElseThrow(() -> new NoSuchElementException("Barn not found: " + dto.barnId()));
        Animal animal = Animal.builder()
                .name(dto.name()).type(dto.type().toLowerCase())
                .weight(dto.weight()).height(dto.height()).barn(barn).notes("").build();
        Animal saved = animalRepository.save(animal);
        log.info("Animal created: id={}, name={}, type={}, barnId={}", saved.getId(), saved.getName(), saved.getType(), barn.getId());
        seedHistoricalData(saved);
        return toDTO(saved);
    }

    private void seedHistoricalData(Animal animal) {
        String simulatorId = animal.getType().toLowerCase() + "-" + animal.getId();
        double baseWeight = animal.getWeight() != null ? animal.getWeight() : 100.0;
        Random rng = new Random();

        // seed last 10 minutes with one movement point every 3 seconds = 200 points
        Instant start = Instant.now().minus(10, ChronoUnit.MINUTES);
        int totalPoints = 10 * 60 / 3; // 200 points

        List<AnimalMetric> metrics = new ArrayList<>(totalPoints);
        for (int i = 0; i < totalPoints; i++) {
            Instant t = start.plus(i * 3L, ChronoUnit.SECONDS);
            AnimalMetric m = new AnimalMetric();
            m.setTime(t);
            m.setAnimalId(simulatorId);
            m.setMovement(rng.nextInt(21));
            metrics.add(m);
        }

        // seed last 10 minutes with one weight point per minute = 10 points
        List<AnimalWeight> weights = new ArrayList<>(10);
        for (int i = 0; i < 10; i++) {
            Instant t = start.plus(i, ChronoUnit.MINUTES);
            AnimalWeight w = new AnimalWeight();
            w.setTime(t);
            w.setAnimalId(simulatorId);
            w.setWeight(BigDecimal
                    .valueOf(Math.max(0.1, Math.round((baseWeight + rng.nextDouble() * 4 - 2) * 10.0) / 10.0)));
            weights.add(w);
        }

        metricRepo.saveAll(metrics);
        weightRepo.saveAll(weights);
    }

    public Optional<HeartRateDTO> getLatestHeartRate(String id) {
        return metricRepo.findLatestHeartRate(id)
                .map(m -> new HeartRateDTO(m.getTime(), m.getAnimalId(), m.getHeartRate()));
    }

    public Optional<TemperatureDTO> getLatestTemperature(String id) {
        return metricRepo.findLatestTemperature(id)
                .map(m -> new TemperatureDTO(m.getTime(), m.getAnimalId(), m.getTemperature()));
    }

    public Optional<StressDTO> getLatestStress(String id) {
        return metricRepo.findLatestStress(id)
                .map(m -> new StressDTO(m.getTime(), m.getAnimalId(), m.getStress()));
    }

    public Optional<MovementDTO> getLatestMovement(String id) {
        return metricRepo.findLatestMovement(id)
                .map(m -> new MovementDTO(m.getTime(), m.getAnimalId(), m.getMovement()));
    }

    public List<DailyMovementDTO> getDailyMovement(String animalId, Instant from, Instant to) {
        return metricRepo.findDailyMovement(animalId, from, to).stream()
                .filter(row -> row[0] != null && row[1] != null)
                .map(row -> new DailyMovementDTO(row[0].toString(), new BigDecimal(row[1].toString())))
                .toList();
    }

    public List<WeeklyWeightDTO> getWeeklyWeight(String animalId, Instant from, Instant to) {
        return weightRepo.findWeeklyWeight(animalId, from, to).stream()
                .filter(row -> row[0] != null && row[1] != null)
                .map(row -> new WeeklyWeightDTO(row[0].toString(), new BigDecimal(row[1].toString())))
                .toList();
    }

    public void delete(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Animal not found: " + id));
        animalRepository.delete(animal);
        log.info("Animal deleted: id={}, name={}", id, animal.getName());
    }

    public AnimalNotesDTO getNotes(String simulatorId) {
        Animal animal = findAnimalBySimulatorId(simulatorId);
        return new AnimalNotesDTO(animal.getNotes() == null ? "" : animal.getNotes());
    }

    public AnimalNotesDTO updateNotes(String simulatorId, AnimalNotesDTO dto) {
        Animal animal = findAnimalBySimulatorId(simulatorId);
        animal.setNotes(dto.notes() == null ? "" : dto.notes());
        Animal saved = animalRepository.save(animal);
        return new AnimalNotesDTO(saved.getNotes() == null ? "" : saved.getNotes());
    }

    public VetInfoDTO getVetInfo(String simulatorId) {
        Animal animal = findAnimalBySimulatorId(simulatorId);
        return new VetInfoDTO(animal.getVetEmail(), animal.getVetPhone());
    }

    public VetInfoDTO updateVetInfo(String simulatorId, VetInfoDTO dto) {
        Animal animal = findAnimalBySimulatorId(simulatorId);
        animal.setVetEmail(dto.vetEmail());
        animal.setVetPhone(dto.vetPhone());
        Animal saved = animalRepository.save(animal);
        return new VetInfoDTO(saved.getVetEmail(), saved.getVetPhone());
    }

    public void notifyVet(String simulatorId, NotifyVetDTO payload) {
        Animal animal = findAnimalBySimulatorId(simulatorId);
        if (animal.getVetEmail() == null || animal.getVetEmail().isBlank()) {
            throw new IllegalStateException("No vet email configured for this animal");
        }

        log.info("Sending vet notification for animal={}, vetEmail={}", simulatorId, animal.getVetEmail());
        try {
            byte[] pdfBytes = buildPdf(payload, animal.getType());

            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);
            helper.setFrom("agrisense03@gmail.com");
            helper.setTo(animal.getVetEmail());
            helper.setSubject("AgriSense Alert: " + animal.getName() + " needs attention");
            helper.setText("Please find attached the health report for " + animal.getName()
                    + " (" + animal.getType() + ").\n\n"
                    + "Vet Notes:\n" + (payload.notes() == null || payload.notes().isBlank() ? "(none)" : payload.notes()));
            final byte[] pdf = pdfBytes;
            helper.addAttachment("health-report.pdf", () -> new java.io.ByteArrayInputStream(pdf));
            mailSender.send(msg);
            log.info("Vet notification sent for animal={}", simulatorId);
        } catch (Exception e) {
            log.error("Failed to send vet notification for animal={}: {}", simulatorId, e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private byte[] buildPdf(NotifyVetDTO d, String species) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfDocument pdf = new PdfDocument(new PdfWriter(out));
            Document doc = new Document(pdf);

            PdfFont bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regular = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            String timestamp = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm 'UTC'")
                    .format(Instant.now().atZone(ZoneOffset.UTC));

            doc.add(new Paragraph("AgriSense – Animal Health Report")
                    .setFont(bold).setFontSize(18).setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph(timestamp)
                    .setFont(regular).setFontSize(10).setTextAlignment(TextAlignment.CENTER).setFontColor(ColorConstants.GRAY));
            doc.add(new Paragraph("\n"));

            // Metrics table
            doc.add(new Paragraph("Current Metrics").setFont(bold).setFontSize(13));
            Table metrics = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25})).useAllAvailableWidth();
            for (String h : new String[]{"Species", "Temperature", "Heart Rate", "Stress"}) {
                metrics.addHeaderCell(new Cell().add(new Paragraph(h).setFont(bold))
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY).setTextAlignment(TextAlignment.CENTER));
            }
            for (String v : new String[]{species, d.temperature(), d.heartRate(), d.stress()}) {
                metrics.addCell(new Cell().add(new Paragraph(v != null ? v : "-").setFont(regular))
                        .setTextAlignment(TextAlignment.CENTER));
            }
            doc.add(metrics);
            doc.add(new Paragraph("\n"));

            // Charts stacked full-width
            doc.add(new Paragraph("Movement & Weight History").setFont(bold).setFontSize(13));
            doc.add(buildChartParagraph("Movement Trend", d.movementData(), regular, bold));
            doc.add(new Paragraph("\n"));
            doc.add(buildChartParagraph("Weight Progress", d.weightData(), regular, bold));
            doc.add(new Paragraph("\n"));

            // Notes
            doc.add(new Paragraph("Vet Notes").setFont(bold).setFontSize(13));
            doc.add(new Paragraph(d.notes() == null || d.notes().isBlank() ? "(none)" : d.notes()).setFont(regular).setFontSize(11));

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to build PDF", e);
        }
    }

    private com.itextpdf.layout.element.Div buildChartParagraph(String title, java.util.List<NotifyVetDTO.ChartPoint> data, PdfFont regular, PdfFont bold) {
        com.itextpdf.layout.element.Div div = new com.itextpdf.layout.element.Div();
        div.add(new Paragraph(title).setFont(bold).setFontSize(11));
        if (data == null || data.isEmpty()) {
            div.add(new Paragraph("No data").setFont(regular).setFontSize(9).setFontColor(ColorConstants.GRAY));
            return div;
        }
        try {
            org.jfree.data.category.DefaultCategoryDataset dataset = new org.jfree.data.category.DefaultCategoryDataset();
            int step = Math.max(1, data.size() / 50);
            for (int i = 0; i < data.size(); i += step) {
                NotifyVetDTO.ChartPoint p = data.get(i);
                String label = p.bucket().length() >= 16 ? p.bucket().substring(11, 16) : p.bucket();
                dataset.addValue(p.value(), title, label);
            }
            org.jfree.chart.JFreeChart chart = org.jfree.chart.ChartFactory.createLineChart(
                    null, null, null, dataset,
                    org.jfree.chart.plot.PlotOrientation.VERTICAL, false, false, false);
            chart.setBackgroundPaint(java.awt.Color.WHITE);
            org.jfree.chart.plot.CategoryPlot plot = chart.getCategoryPlot();
            plot.setBackgroundPaint(java.awt.Color.WHITE);
            org.jfree.chart.axis.CategoryAxis domainAxis = plot.getDomainAxis();
            domainAxis.setVisible(true);
            domainAxis.setCategoryLabelPositions(org.jfree.chart.axis.CategoryLabelPositions.UP_45);
            domainAxis.setTickLabelFont(new java.awt.Font("SansSerif", java.awt.Font.PLAIN, 8));
            java.awt.image.BufferedImage img = chart.createBufferedImage(800, 250);
            ByteArrayOutputStream imgOut = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(img, "png", imgOut);
            com.itextpdf.io.image.ImageData imgData = com.itextpdf.io.image.ImageDataFactory.create(imgOut.toByteArray());
            div.add(new com.itextpdf.layout.element.Image(imgData).setWidth(UnitValue.createPercentValue(100)));
        } catch (Exception e) {
            div.add(new Paragraph("Chart unavailable").setFont(regular).setFontSize(9).setFontColor(ColorConstants.GRAY));
        }
        return div;
    }

    private Animal findAnimalBySimulatorId(String simulatorId) {
        int separatorIndex = simulatorId.lastIndexOf('-');
        if (separatorIndex <= 0 || separatorIndex == simulatorId.length() - 1) {
            throw new NoSuchElementException("Animal not found: " + simulatorId);
        }

        String type = simulatorId.substring(0, separatorIndex);
        Long id = Long.parseLong(simulatorId.substring(separatorIndex + 1));

        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Animal not found: " + simulatorId));

        if (!animal.getType().equalsIgnoreCase(type)) {
            throw new NoSuchElementException("Animal not found: " + simulatorId);
        }

        return animal;
    }

    private AnimalDTO toDTO(Animal a) {
        String simulatorId = a.getType().toLowerCase() + "-" + a.getId();
        return new AnimalDTO(a.getId(), a.getName(), a.getType(), a.getWeight(), a.getHeight(), a.getBarn().getId(),
                simulatorId);
    }
}
