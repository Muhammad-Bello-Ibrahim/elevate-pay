import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  size?: number;
}

const QRCodeDisplay = ({ value, title = "QR Code", size = 200 }: QRCodeDisplayProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "elevatex-qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "QR Code Downloaded! 📥",
      description: "QR code saved to your device",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Elevatex",
          text: "Join me on Elevatex and start earning with our referral system!",
          url: value,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(value);
      toast({
        title: "Link Copied! 📋",
        description: "Referral link copied to clipboard",
      });
    }
  };

  return (
    <Card className="p-6 text-center space-y-4 bg-gradient-card shadow-card border-0">
      <h3 className="font-bold text-foreground">{title}</h3>
      
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-lg">
          <QRCode
            id="qr-code"
            value={value}
            size={size}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 ${size} ${size}`}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex-1"
        >
          <Download size={16} className="mr-2" />
          Download
        </Button>
        <Button
          onClick={handleShare}
          className="flex-1 bg-gradient-primary"
        >
          <Share2 size={16} className="mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
};

export default QRCodeDisplay;