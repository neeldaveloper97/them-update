import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Trash2 } from 'lucide-react';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';

export default function UploadedFilesList({
  images,
  visibleData,
  currentPage,
  totalPages,
  setCurrentPage,
  downloadFile,
  downloadAllFiles,
  handleDeleteClick,
  deletingKey,
}) {
  return (
    <div className="bg-white shadow-1 rounded-xl h-full flex flex-col">
      <div className="flex justify-between items-center p-3.5 lg:p-5">
        <h2 className="font-bold text-org-primary-dark text-xl lg:text-2xl">
          Bills You’ve Uploaded
        </h2>
        <Button
          className="bg-org-primary"
          onClick={() => downloadAllFiles(images)}
          disabled={images.length === 0}
        >
          Download All Files
        </Button>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full min-w-xl text-left table-auto">
          <thead>
            <tr className="border-gray-200 border-y">
              <th className="px-5 py-2.5 font-normal text-muted-text text-sm">
                File Name
              </th>
              <th className="px-5 py-2.5 font-normal text-muted-text text-sm">
                Date
              </th>
              <th className="px-5 py-2.5 font-normal text-muted-text text-sm w-12">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-org-primary-dark text-left">
            {visibleData.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-gray-500 text-center">
                  No files to display.
                </td>
              </tr>
            ) : (
              visibleData.map((item, index) => {
                return (
                  <tr
                    key={`${item.id}-${item.date}-${index}`}
                    className="hover:bg-gray-50 border-gray-100 border-b"
                  >
                    <td className="px-5 py-3 text-sm leading-6">
                      {capitalizeFirstLetter(item.id)}
                    </td>
                    <td className="px-5 py-3 text-sm leading-6">{item.date}</td>
                    <td className="px-5 py-3 text-sm leading-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          className="bg-org-primary rounded-xl"
                          onClick={() => downloadFile(item.signed_url, item.id)}
                        >
                          <Icon
                            icon="solar:download-outline"
                            width="40"
                            height="40"
                          />
                          <span className="hidden lg:inline-block">
                            Download
                          </span>
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 rounded-xl"
                          onClick={() => handleDeleteClick(item)}
                          disabled={deletingKey === item.s3_key}
                        >
                          {deletingKey === item.s3_key ? (
                            <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
                          ) : (
                            <Trash2 width="16" height="16" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3.5 lg:p-5">
        <Pagination className="justify-end">
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <button
                className={`px-3 py-1 text-sm rounded-md border transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'}`}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }
                }}
                disabled={currentPage === 1}
              >
                Prev
              </button>
            </PaginationItem>
            {(() => {
              const maxButtons = 3;
              const half = Math.floor(maxButtons / 2);
              let start = Math.max(1, currentPage - half);
              let end = Math.min(totalPages, currentPage + half);
              if (currentPage <= half) {
                end = Math.min(totalPages, maxButtons);
              }
              if (currentPage + half >= totalPages) {
                start = Math.max(1, totalPages - maxButtons + 1);
              }
              const pages = [];
              for (let i = start; i <= end; i++) {
                pages.push(i);
              }
              return (
                <>
                  {start > 1 && (
                    <>
                      <PaginationItem>
                        <button
                          className={`px-3 py-1 text-sm rounded-md border transition-colors ${currentPage === 1 ? 'bg-org-primary text-white border-org-primary' : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'}`}
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </button>
                      </PaginationItem>
                      {start > 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}
                  {pages.map((pageNum) => (
                    <PaginationItem key={`page-${pageNum}`}>
                      <button
                        className={`px-3 py-1 text-sm rounded-md border transition-colors ${currentPage === pageNum ? 'bg-org-primary text-white border-org-primary' : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </PaginationItem>
                  ))}
                  {end < totalPages && (
                    <>
                      {end < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <button
                          className={`px-3 py-1 text-sm rounded-md border transition-colors ${currentPage === totalPages ? 'bg-org-primary text-white border-org-primary' : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'}`}
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </PaginationItem>
                    </>
                  )}
                </>
              );
            })()}
            <PaginationItem>
              <button
                className={`px-3 py-1 text-sm rounded-md border transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'}`}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
