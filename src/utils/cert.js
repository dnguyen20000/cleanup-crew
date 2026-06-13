import { jsPDF } from 'jspdf'

export function downloadCertificate(user) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()

  doc.setFillColor(12, 12, 14)
  doc.rect(0, 0, w, h, 'F')

  doc.setDrawColor(47, 174, 122)
  doc.setLineWidth(4)
  doc.rect(24, 24, w - 48, h - 48)

  doc.setTextColor(47, 174, 122)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(34)
  doc.text('CleanUp Crew', w / 2, 110, { align: 'center' })

  doc.setTextColor(245, 245, 247)
  doc.setFontSize(22)
  doc.text('Certificate of Volunteer Service', w / 2, 160, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)
  doc.setTextColor(154, 154, 162)
  doc.text('This certifies that', w / 2, 210, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.setTextColor(245, 245, 247)
  doc.text(user.name || 'Volunteer', w / 2, 250, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)
  doc.setTextColor(154, 154, 162)
  doc.text(
    `has contributed ${user.totalHours || 0} verified volunteer hours across ${
      user.cleanups || 0
    } community cleanups,`,
    w / 2,
    296,
    { align: 'center' }
  )
  doc.text(
    `helping remove an estimated ${user.lbsCollected || 0} lbs of litter from local communities.`,
    w / 2,
    318,
    { align: 'center' }
  )

  doc.setFontSize(12)
  doc.setTextColor(107, 107, 115)
  doc.text(`Rank achieved: ${user.rank || 'Volunteer'}`, w / 2, 360, { align: 'center' })
  doc.text(
    `Issued ${new Date().toLocaleDateString()}  ·  CleanUp Crew Volunteer Program`,
    w / 2,
    h - 60,
    { align: 'center' }
  )

  doc.save(`CleanUpCrew-Certificate-${(user.name || 'Volunteer').replace(/\s+/g, '')}.pdf`)
}
