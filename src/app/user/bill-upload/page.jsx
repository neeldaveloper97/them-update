'use client';

import MedicalBillUploader from '@/components/BillUpload/MedicalBillUploader';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { getImageThunk, uploadImageThunk } from '@/store/slices/imageSlice';
import {
  acknowledgeListRefresh,
  getMedicalBillsThunk,
} from '@/store/slices/medOptimizeSlice';
import { useEffect, useState, useRef, useMemo } from 'react';
import { initializeSocket, disconnectSocket } from '@/services/socketService';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUserImages } from '@/hooks/user-files';
import { useParams, useRouter } from 'next/navigation';
import POADialog from '@/components/BillUpload/POADialog';
import DeleteConfirmationDialog from '@/components/BillUpload/DeleteConfirmationDialog';
import ReportIssueDialog from '@/components/BillUpload/ReportIssueDialog';
import UploadedFilesList from '@/components/BillUpload/UploadedFilesList';
import MedicalBillsList from '@/components/BillUpload/MedicalBillsList';
import AIRecommendationsPanel from '@/components/BillUpload/AIRecommendationsPanel';
import { selectAuth } from '@/store/slices/authSlice';
import {
  handleDeleteFile,
  handleNegotiationStart,
  handleRetryBillProcessing,
  handleDownloadFile,
  handleDownloadAllFiles,
} from '@/utils/apiHandlers';
import TourProvider from '@/components/TourProvider';
import { BILL_UPLOAD_TOUR_STEPS } from '@/constants/tourSteps';
import GlobalLoader from '@/components/GlobalLoader';
import { onAllRequestsDone } from '@/lib/axiosInstance';

export default function BillUploadPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const urlparam = useParams();
  const orgId = urlparam.orgId;

  const { user } = useSelector(selectAuth);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentMedPage, setCurrentMedPage] = useState(1);
  const [userId, setUserId] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [poaDialog, setPoaDialog] = useState({
    isOpen: false,
    billId: null,
  });
  const [reportIssueModal, setReportIssueModal] = useState({
    isOpen: false,
    billId: null,
    error: null,
  });
  const [deletingKey, setDeletingKey] = useState(null);
  const [runBillTour, setRunBillTour] = useState(false);

  const [socketBills, setSocketBills] = useState([]);
  const socketRef = useRef(null);
  const [tourAlreadyRun, setTourAlreadyRun] = useState(false);

  const [selectedBill, setSelectedBill] = useState(null);
  const aiPanelRef = useRef(null);

  useEffect(() => {
    if (user?.data?.isSubscribed !== undefined) {
      setIsUserSubscribed(user.data.isSubscribed);
    }
  }, [user]);

  const { images, fetchImages } = useUserImages(userId);

  const bills = useSelector((state) => state.medOptimize?.bills || []);

  const mergeBillsById = useMemo(() => {
    return (baseBills = [], socketBills = []) => {
      if (!Array.isArray(baseBills)) baseBills = [];
      if (!Array.isArray(socketBills)) socketBills = [];

      const billsMap = new Map();

      baseBills.forEach((bill) => {
        const id = bill.id || bill._id;
        if (id) {
          billsMap.set(id, { ...bill });
        }
      });

      socketBills.forEach((bill) => {
        const id = bill.id || bill._id;
        if (id) {
          const existingBill = billsMap.get(id);
          if (existingBill) {
            billsMap.set(id, { ...existingBill, ...bill });
          } else {
            billsMap.set(id, { ...bill });
          }
        }
      });

      return Array.from(billsMap.values()).sort((a, b) => {
        const dateA = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
        const dateB = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
        return dateB - dateA;
      });
    };
  }, []);

  const shouldRefetch = useSelector((s) => s.medOptimize.shouldRefetchList);

  useEffect(() => {
    const storedId = sessionStorage.getItem('chatUserId');
    if (storedId) {
      setUserId(storedId);
    }

    socketRef.current = initializeSocket({
      onDashboardEvent: (data) => {
        const incoming = Array.isArray(data?.data?.data) ? data.data.data : [];
        if (incoming.length === 0) return;

        setSocketBills((prevSocketBills) => {
          return mergeBillsById(prevSocketBills, incoming);
        });
        setSelectedBill(incoming[0]);

        if (data?.step) toast.success(data.step);
      },
    });

    return () => {
      if (socketRef.current) disconnectSocket(socketRef.current);
    };
  }, [mergeBillsById]);

  useEffect(() => {
    if (!userId) return;

    if (shouldRefetch || !bills || bills.length === 0) {
      dispatch(getMedicalBillsThunk(userId))
        .then(() => {
          setSocketBills([]);
        })
        .finally(() => {
          if (shouldRefetch) {
            dispatch(acknowledgeListRefresh());
          }
        });
    }

    if (!images || images.length === 0) {
      fetchImages();
    }
  }, [userId, dispatch, shouldRefetch]);

  useEffect(() => {
    if (tourAlreadyRun) return;
    onAllRequestsDone(() => {
      const dashboardTourDone =
        localStorage.getItem('dashboardTourCompleted') === 'true';
      const billTourDone = localStorage.getItem('billTourCompleted') === 'true';
      const shouldStartBillTour =
        localStorage.getItem('startBillTour') === 'true';

      if (shouldStartBillTour && !billTourDone && !dashboardTourDone) {
        setTimeout(() => {
          setRunBillTour(true);
          setTourAlreadyRun(true);
        });
      }
    });
  }, [tourAlreadyRun]);

  const billsToShow = useMemo(() => {
    if (socketBills.length > 0) {
      return mergeBillsById(bills, socketBills);
    }
    return bills || [];
  }, [bills, socketBills, mergeBillsById]);

  const handleDelete = async () => {
    await handleDeleteFile({
      item: deleteModal.item,
      dispatch,
      fetchImages,
      setDeletingKey,
      setDeleteModal,
      setCurrentPage,
      images,
      userId,
    });
  };

  const retryBillProcessing = (billId) => {
    handleRetryBillProcessing({ billId, dispatch, userId });
  };

  const submitIssueReport = () => {
    toast.success('Issue reported successfully. Our team will investigate.');
    setReportIssueModal({ isOpen: false, billId: null, error: null });
  };

  const handlePOASubmit = async (poaData) => {
    const res = await handleNegotiationStart({
      id: poaDialog.billId,
      dispatch,
      router,
      orgId,
      poa: poaData,
    });
    if (res?.success) {
      setPoaDialog({ isOpen: false, billId: null });
    }
    return res;
  };

  const itemsPerPage = 4;
  const totalPages = Math.ceil(images?.length / itemsPerPage) || 1;
  const visibleData = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalMedPages = Math.ceil(billsToShow?.length / itemsPerPage) || 1;
  const visibleMedData = billsToShow.slice(
    (currentMedPage - 1) * itemsPerPage,
    currentMedPage * itemsPerPage
  );

  const enhancedRecommendations = [
    {
      text: 'Overcharged procedure detected',
      type: 'error',
      potential: '$1,250',
      confidence: 'High',
      action: 'Negotiate',
    },
    {
      text: 'Duplicate billing found',
      type: 'error',
      potential: '$400',
      confidence: 'High',
      action: 'Dispute',
    },
    {
      text: 'Coding accuracy to verify for Procedure Y',
      type: 'warning',
      potential: '$200-500',
      confidence: 'Medium',
      action: 'Review',
    },
    {
      text: 'Consider negotiating Procedure X charges',
      type: 'suggestion',
      potential: '$300',
      confidence: 'Medium',
      action: 'Start Negotiate',
    },
  ];

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'suggestion':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  const billsSectionRef = useRef(null);

  const handleUploadSuccess = () => {
    if (billsSectionRef.current) {
      billsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    if (aiPanelRef.current) {
      aiPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <GlobalLoader />
      {runBillTour && <TourProvider steps={BILL_UPLOAD_TOUR_STEPS} />}

      <POADialog
        open={poaDialog.isOpen}
        onOpenChange={() => setPoaDialog({ isOpen: false, billId: null })}
        onConfirm={handlePOASubmit}
        userData={user}
      />

      <DeleteConfirmationDialog
        open={deleteModal.isOpen}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
        onDelete={handleDelete}
        deletingKey={deletingKey}
        item={deleteModal.item}
      />

      <ReportIssueDialog
        open={reportIssueModal.isOpen}
        onCancel={() =>
          setReportIssueModal({ isOpen: false, billId: null, error: null })
        }
        onSubmit={submitIssueReport}
      />

      <div className="space-y-6">
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-8">
          <div className="col-span-1 lg:col-span-3" data-tour="bill-uploader">
            <MedicalBillUploader
              uploadImageThunk={uploadImageThunk}
              userId={userId}
              dispatch={dispatch}
              getMedicalBillsThunk={getMedicalBillsThunk}
              getImageThunk={getImageThunk}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          <div className="col-span-1 lg:col-span-5" data-tour="uploaded-files">
            <UploadedFilesList
              images={images}
              visibleData={visibleData}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              downloadFile={handleDownloadFile}
              downloadAllFiles={handleDownloadAllFiles}
              handleDeleteClick={(item) =>
                setDeleteModal({ isOpen: true, item })
              }
              deletingKey={deletingKey}
            />
          </div>

          <div
            className="col-span-1 lg:col-span-4"
            data-tour="analyzed-bills"
            ref={billsSectionRef}
          >
            <MedicalBillsList
              visibleMedData={visibleMedData}
              currentMedPage={currentMedPage}
              totalMedPages={totalMedPages}
              setCurrentMedPage={setCurrentMedPage}
              orgId={orgId}
              isUserSubscribed={isUserSubscribed}
              handleStartNegotiation={(id) =>
                setPoaDialog({ isOpen: true, billId: id })
              }
              retryBillProcessing={retryBillProcessing}
              handleReportIssue={(billId, error) =>
                setReportIssueModal({ isOpen: true, billId, error })
              }
              router={router}
              onSelectBill={handleSelectBill}
            />
          </div>

          <div
            className="col-span-1 lg:col-span-4"
            data-tour="ai-recommendations"
            ref={aiPanelRef}
          >
            <AIRecommendationsPanel
              bill={selectedBill}
              enhancedRecommendations={enhancedRecommendations}
              isUserSubscribed={isUserSubscribed}
              router={router}
              orgId={orgId}
              getRecommendationIcon={getRecommendationIcon}
              visibleMedData={visibleMedData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
